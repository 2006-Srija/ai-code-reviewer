 
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get GitHub event type from headers
  const event = req.headers['x-github-event'];
  
  // Handle webhook ping (GitHub sends this when configuring webhook)
  if (event === 'ping') {
    console.log('✅ Webhook configured successfully!');
    return res.status(200).json({ message: 'Webhook is alive!' });
  }
  
  // Handle pull request events
  if (event === 'pull_request') {
    const payload = req.body;
    const action = payload.action;
    const prNumber = payload.pull_request.number;
    const repoName = payload.repository.full_name;
    const prTitle = payload.pull_request.title;
    const prUrl = payload.pull_request.html_url;
    
    console.log(`📦 PR ${action}: ${repoName}#${prNumber} - ${prTitle}`);
    
    // Only review when PR is opened or synchronized (new commits)
    if (action === 'opened' || action === 'synchronize') {
      console.log(`🔍 Starting code review for PR #${prNumber}...`);
      
      try {
        // Fetch the PR diff from GitHub
        const token = process.env.GITHUB_TOKEN;
        const apiUrl = `https://api.github.com/repos/${repoName}/pulls/${prNumber}`;
        
        const { stdout } = await execAsync(`curl -s -H "Authorization: token ${token}" ${apiUrl}`);
        const prData = JSON.parse(stdout);
        const diffUrl = prData.diff_url;
        
        // Get the actual code changes
        const { stdout: diff } = await execAsync(`curl -s ${diffUrl}`);
        
        // Analyze with security agent
        const { stdout: analysis } = await execAsync(`echo "${diff.replace(/"/g, '\\"')}" | python python_api.py review security`);
        
        // Post comment back to GitHub PR
        const comment = `## 🤖 AI Code Review Results\n\n${analysis}`;
        await execAsync(`curl -s -X POST -H "Authorization: token ${token}" -H "Accept: application/vnd.github.v3+json" ${apiUrl}/comments -d '{"body": ${JSON.stringify(comment)}}'`);
        
        console.log(`✅ Review posted to PR #${prNumber}`);
      } catch (error) {
        console.error(`❌ Review failed for PR #${prNumber}:`, error.message);
      }
    }
    
    return res.status(200).json({ received: true, action });
  }
  
  // Other events (just log them)
  console.log(`📝 Received event: ${event}`);
  res.status(200).json({ event });
}