import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  const { code, issueType = 'security' } = req.body;
  
  try {
    // Call Python agent with the code
    const { stdout, stderr } = await execAsync(
      `echo "${code.replace(/"/g, '\\"')}" | python python_api.py review ${issueType}`
    );
    
    const result = JSON.parse(stdout);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Agent analysis failed' });
  }
}