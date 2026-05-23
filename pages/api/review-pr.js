import { GitHubAPI } from '../../lib/github/githubApi';
import { reviewCode } from '../../lib/ai/reviewer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prUrl, code, token } = req.body;

  try {
    const github = new GitHubAPI(token || process.env.GITHUB_TOKEN);
    
    if (prUrl) {
      // Parse GitHub PR URL
      const match = prUrl.match(/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)/);
      if (!match) {
        return res.status(400).json({ error: 'Invalid GitHub PR URL' });
      }

      const [, owner, repo, prNumber] = match;

      // Get PR details
      const prDetails = await github.getPRDetails(owner, repo, prNumber);
      
      // Get all files
      const files = await github.getPRFiles(owner, repo, prNumber);
      
      const fileReviews = [];
      
      for (const file of files.slice(0, 10)) {
        if (file.filename.match(/\.(js|jsx|ts|tsx|py|java|cpp|go|rb|php)$/)) {
          const content = await github.getFileContent(file.contents_url);
          const review = await reviewCode(content, file.filename);
          fileReviews.push({
            filename: file.filename,
            status: file.status,
            additions: file.additions,
            deletions: file.deletions,
            changes: file.changes,
            review
          });
        }
      }

      const avgScore = fileReviews.length > 0
        ? Math.round(fileReviews.reduce((sum, f) => sum + (f.review.score || 0), 0) / fileReviews.length)
        : 0;

      return res.status(200).json({
        score: avgScore,
        files: fileReviews,
        prNumber,
        repository: `${owner}/${repo}`,
        title: prDetails.title,
        author: prDetails.user.login,
        createdAt: prDetails.created_at
      });
    } 
    else if (code) {
      // Direct code review
      const review = await reviewCode(code, 'code.js');
      return res.status(200).json({
        score: review.score,
        files: [{
          filename: 'code.js',
          review
        }]
      });
    }
    else {
      return res.status(400).json({ error: 'No code or PR URL provided' });
    }
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: error.message });
  }
}