import { saveReviewToDynamoDB } from '../../lib/dynamodb.service.js';
import { GitHubAPI } from '../../lib/github/githubApi';
import { reviewCode } from '../../lib/ai/reviewer';
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

async function processPullRequest(payload) {
  const { repository, pull_request } = payload;
  const github = new GitHubAPI(process.env.GITHUB_TOKEN);
  
  console.log(`🔍 Analyzing PR #${pull_request.number} in ${repository.full_name}`);
  
  // DEBUG: Log user information to see what IDs are available
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
  
  for (const file of files) {
    if (file.filename.match(/\.(js|jsx|ts|tsx|py|java|cpp|go|rb|php)$/)) {
      console.log(`📄 Reviewing: ${file.filename}`);
      
      const content = await github.getFileContent(file.contents_url);
      const review = await reviewCode(content, file.filename);
      
      // SAVE TO DYNAMODB - FIXED WITH CORRECT USER ID
      try {
        // IMPORTANT: Using the userId from your debug-user output
        const userId = "180918195"; // Your actual session userId
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
        console.error('❌ Error details:', dbError.message);
      }
      
      if (review.bugs?.length || review.security?.length || review.performance?.length) {
        comments.push({
          file: file.filename,
          review: review
        });
      }
      
      totalScore += review.score;
      fileCount++;
    }
  }
  
  if (comments.length > 0) {
    const avgScore = fileCount > 0 ? Math.round(totalScore / fileCount) : 0;
    const comment = formatPRComment(comments, avgScore);
    
    await github.postComment(
      repository.owner.login,
      repository.name,
      pull_request.number,
      comment
    );
  }
  
  console.log('✅ PR review complete!');
}

function formatPRComment(comments, avgScore) {
  let text = `## 🤖 AI Code Review Results\n\n`;
  text += `**Overall Score: ${avgScore}/100**\n\n`;
  
  for (const item of comments) {
    text += `### 📁 ${item.file}\n`;
    text += `Score: ${item.review.score}/100\n\n`;
    
    if (item.review.bugs?.length) {
      text += `**🐛 Bugs:**\n`;
      item.review.bugs.forEach(b => text += `- Line ${b.line}: ${b.message}\n`);
      text += `\n`;
    }
    
    if (item.review.security?.length) {
      text += `**🔒 Security:**\n`;
      item.review.security.forEach(s => text += `- Line ${s.line}: ${s.message}\n`);
      text += `\n`;
    }
    
    if (item.review.performance?.length) {
      text += `**⚡ Performance:**\n`;
      item.review.performance.forEach(p => text += `- Line ${p.line}: ${p.message}\n`);
      text += `\n`;
    }
  }
  
  text += `---\n*Powered by AI Code Reviewer*`;
  return text;
}

export default withErrorHandler(handler);