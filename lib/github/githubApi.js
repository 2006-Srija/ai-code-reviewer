import axios from 'axios';

export class GitHubAPI {
  constructor(token) {
    this.token = token;
    this.baseURL = 'https://api.github.com';
  }

  async getPRFiles(owner, repo, prNumber) {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}/pulls/${prNumber}/files`,
        { headers: { Authorization: `token ${this.token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching PR files:', error);
      return [];
    }
  }

  async getFileContent(url) {
    try {
      const response = await axios.get(url, {
        headers: { 
          Authorization: `token ${this.token}`,
          Accept: 'application/vnd.github.v3.raw'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching file:', error);
      return '';
    }
  }

  async postComment(owner, repo, prNumber, body) {
    try {
      const response = await axios.post(
        `${this.baseURL}/repos/${owner}/${repo}/issues/${prNumber}/comments`,
        { body },
        { headers: { Authorization: `token ${this.token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error posting comment:', error);
      return null;
    }
  }

  // ========== NEW METHODS FOR PAST/EXISTING PR REVIEW ==========

  /**
   * Get details of any PR (past, present, future)
   */
  async getPRDetails(owner, repo, prNumber) {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}/pulls/${prNumber}`,
        { headers: { Authorization: `token ${this.token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching PR details:', error);
      throw error;
    }
  }

  /**
   * Get ALL commits in a PR
   */
  async getPRCommits(owner, repo, prNumber) {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}/pulls/${prNumber}/commits`,
        { headers: { Authorization: `token ${this.token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching PR commits:', error);
      return [];
    }
  }

  /**
   * Get review comments already posted on a PR
   */
  async getPRComments(owner, repo, prNumber) {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}/pulls/${prNumber}/comments`,
        { headers: { Authorization: `token ${this.token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching PR comments:', error);
      return [];
    }
  }

  /**
   * Get repository information
   */
  async getRepoInfo(owner, repo) {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}`,
        { headers: { Authorization: `token ${this.token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching repo info:', error);
      return null;
    }
  }

  /**
   * Get user information
   */
  async getUserInfo(username) {
    try {
      const response = await axios.get(
        `${this.baseURL}/users/${username}`,
        { headers: { Authorization: `token ${this.token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  }

  /**
   * Check if a PR is mergeable and get merge status
   */
  async getPRMergeStatus(owner, repo, prNumber) {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}/pulls/${prNumber}`,
        { headers: { Authorization: `token ${this.token}` } }
      );
      return {
        mergeable: response.data.mergeable,
        mergeableState: response.data.mergeable_state,
        merged: response.data.merged,
        mergedAt: response.data.merged_at,
        mergeCommitSha: response.data.merge_commit_sha
      };
    } catch (error) {
      console.error('Error fetching merge status:', error);
      return null;
    }
  }

  /**
   * Get changed files with detailed stats (additions/deletions per file)
   */
  async getPRFilesWithStats(owner, repo, prNumber) {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}/pulls/${prNumber}/files`,
        { headers: { Authorization: `token ${this.token}` } }
      );
      return response.data.map(file => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        changes: file.changes,
        patch: file.patch,
        contents_url: file.contents_url,
        raw_url: file.raw_url
      }));
    } catch (error) {
      console.error('Error fetching PR files with stats:', error);
      return [];
    }
  }

  /**
   * Get pull request timeline/events
   */
  async getPRTimeline(owner, repo, prNumber) {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}/issues/${prNumber}/timeline`,
        { 
          headers: { Authorization: `token ${this.token}` },
          params: { per_page: 100 }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching PR timeline:', error);
      return [];
    }
  }

  /**
   * List all open pull requests for a repo
   */
  async listOpenPRs(owner, repo, options = {}) {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}/pulls`,
        { 
          headers: { Authorization: `token ${this.token}` },
          params: {
            state: 'open',
            sort: 'updated',
            direction: 'desc',
            per_page: options.perPage || 30,
            ...options
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error listing open PRs:', error);
      return [];
    }
  }

  /**
   * List all closed/merged pull requests
   */
  async listClosedPRs(owner, repo, options = {}) {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}/pulls`,
        { 
          headers: { Authorization: `token ${this.token}` },
          params: {
            state: 'closed',
            sort: 'updated',
            direction: 'desc',
            per_page: options.perPage || 30,
            ...options
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error listing closed PRs:', error);
      return [];
    }
  }

  /**
   * Get diff of a PR as text
   */
  async getPRDiff(owner, repo, prNumber) {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}/pulls/${prNumber}`,
        { 
          headers: { 
            Authorization: `token ${this.token}`,
            Accept: 'application/vnd.github.v3.diff'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching PR diff:', error);
      return '';
    }
  }

  /**
   * Get the entire repository codebase (for advanced analysis)
   */
  async getRepoContents(owner, repo, path = '') {
    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${owner}/${repo}/contents/${path}`,
        { headers: { Authorization: `token ${this.token}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching repo contents:', error);
      return [];
    }
  }
}