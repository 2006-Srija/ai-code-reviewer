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
}