import { saveReviewToDynamoDB } from '../../lib/dynamodb.service.js';
import { GitHubAPI } from '../../lib/github/githubApi';
import { withErrorHandler } from '../../lib/utils/errorHandler';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const event = req.headers['x-github-event'];
  const payload = req.body;

  console.log(`📢 GitHub Event: ${event}`);

  if (event === 'pull_request' && 
      (payload.action === 'opened' || payload.action === 'synchronize')) {
    
    // Process in background without blocking response
    processPullRequest(payload).catch(console.error);
    
    return res.status(200).json({ received: true });
  }

  res.status(200).json({ message: 'Event ignored' });
}

async function callAthenaReview(code, filename) {
  try {
    // Call Athena API locally
    const response = await fetch('http://localhost:3000/api/athena', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, filename })
    });
    
    if (!response.ok) {
      throw new Error(`Athena API returned ${response.status}`);
    }
    
    const review = await response.json();
    return review;
  } catch (error) {
    console.error('Athena review failed, using fallback:', error.message);
    // Fallback mock review
    return {
      score: 75,
      total_issues: 1,
      findings: [
        {
          agent: "Quality Agent",
          file: filename,
          line: 1,
          severity: "low",
          title: "Code review pending",
          description: "Athena service unavailable, using basic review",
          suggestion: "Check Athena service status",
          fix: ""
        }
      ]
    };
  }
}

async function processPullRequest(payload) {
  const { repository, pull_request } = payload;
  const github = new GitHubAPI(process.env.GITHUB_TOKEN);
  
  console.log(`🔍 Analyzing PR #${pull_request.number} in ${repository.full_name}`);
  
  console.log('🔍 DEBUG - Pull Request User Object:', {
    id: pull_request.user.id,
    login: pull_request.user.login,
    node_id: pull_request.user.node_id,
    type: pull_request.user.type
  });
  
  const files = await github.getPRFiles(
    repository.owner.login,
    repository.name,
    pull_request.number
  );
  
  let comments = [];
  let totalScore = 0;
  let fileCount = 0;
  let allFindings = [];
  
  for (const file of files) {
    if (file.filename.match(/\.(js|jsx|ts|tsx|py|java|cpp|go|rb|php)$/)) {
      console.log(`📄 Reviewing: ${file.filename}`);
      
      const content = await github.getFileContent(file.contents_url);
      
      // Call Athena for code review
      const review = await callAthenaReview(content, file.filename);
      
      // SAVE TO DYNAMODB
      try {
        const userId = "180918195";
        console.log(`🔍 DEBUG - Saving review for userId: ${userId}`);
        console.log(`🔍 DEBUG - Review data:`, {
          repo: repository.full_name,
          prNumber: pull_request.number,
          score: review.score
        });
        
        await saveReviewToDynamoDB(
          userId,
          repository.full_name,
          pull_request.number,
          review
        );
        console.log(`✅ Review saved to DynamoDB for ${file.filename}`);
      } catch (dbError) {
        console.error('❌ Failed to save review to DynamoDB:', dbError);
      }
      
      // Format findings for comment
      if (review.findings && review.findings.length > 0) {
        comments.push({
          file: file.filename,
          review: review
        });
        allFindings.push(...review.findings);
      }
      
      totalScore += review.score;
      fileCount++;
    }
  }
  
  if (comments.length > 0) {
    const avgScore = fileCount > 0 ? Math.round(totalScore / fileCount) : 0;
    const comment = formatPRComment(comments, avgScore, allFindings);
    
    await github.postComment(
      repository.owner.login,
      repository.name,
      pull_request.number,
      comment
    );
  }
  
  console.log('✅ PR review complete!');
}

function formatPRComment(comments, avgScore, allFindings) {
  let text = `## 🦉 Athena AI Code Review\n\n`;
  text += `**Overall Score: ${avgScore}/100**\n\n`;
  
  // Group findings by severity
  const critical = allFindings.filter(f => f.severity === 'critical');
  const high = allFindings.filter(f => f.severity === 'high');
  const medium = allFindings.filter(f => f.severity === 'medium');
  const low = allFindings.filter(f => f.severity === 'low');
  
  if (critical.length > 0) {
    text += `### 🔴 Critical Issues (Must Fix)\n`;
    critical.forEach(f => {
      text += `- **${f.agent}** : ${f.title}\n`;
      if (f.fix) text += `  - 💡 Fix: \`${f.fix}\`\n`;
    });
    text += `\n`;
  }
  
  if (high.length > 0) {
    text += `### 🟠 High Severity\n`;
    high.forEach(f => {
      text += `- **${f.agent}** : ${f.title}\n`;
      if (f.fix) text += `  - 💡 Fix: \`${f.fix}\`\n`;
    });
    text += `\n`;
  }
  
  if (medium.length > 0) {
    text += `### 🟡 Medium Severity\n`;
    medium.forEach(f => {
      text += `- **${f.agent}** : ${f.title}\n`;
    });
    text += `\n`;
  }
  
  if (low.length > 0) {
    text += `### 🔵 Low Severity / Suggestions\n`;
    low.forEach(f => {
      text += `- **${f.agent}** : ${f.title}\n`;
    });
    text += `\n`;
  }
  
  // File-wise breakdown
  text += `### 📁 File-wise Breakdown\n`;
  for (const item of comments) {
    text += `**${item.file}** (Score: ${item.review.score}/100)\n`;
    if (item.review.findings && item.review.findings.length > 0) {
      item.review.findings.forEach(f => {
        text += `- ${f.title} (${f.severity})\n`;
      });
    }
    text += `\n`;
  }
  
  text += `---\n*Powered by Athena — Code Intelligence Platform*`;
  return text;
}

export default withErrorHandler(handler);