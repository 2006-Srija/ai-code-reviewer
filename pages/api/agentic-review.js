import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, filename = 'code.js' } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    // Create temporary Python script
    const tempPyPath = path.join(__dirname, '../../temp_review.py');
    const tempCodePath = path.join(__dirname, '../../temp_code.txt');
    
    const pythonScript = `import sys
import json
import asyncio

sys.path.insert(0, r'${process.cwd().replace(/\\/g, '/')}')

from agents.orchestrator import Orchestrator

async def review():
    orch = Orchestrator()
    with open(sys.argv[1], 'r') as f:
        code = f.read()
    filename = sys.argv[2] if len(sys.argv) > 2 else 'code.js'
    result = await orch.review_code(code, filename)
    print(json.dumps(result))

asyncio.run(review())
`;

    fs.writeFileSync(tempPyPath, pythonScript, 'utf8');
    fs.writeFileSync(tempCodePath, code, 'utf8');

    const { stdout, stderr } = await execAsync(
      `python "${tempPyPath}" "${tempCodePath}" "${filename}"`,
      { timeout: 30000 }
    );

    // Clean up
    fs.unlinkSync(tempPyPath);
    fs.unlinkSync(tempCodePath);

    if (stderr && !stderr.includes('DeprecationWarning')) {
      console.error('Python stderr:', stderr);
    }

    const review = JSON.parse(stdout);
    res.status(200).json(review);

  } catch (error) {
    console.error('Agentic review error:', error);
    res.status(500).json({ 
      error: 'Review failed', 
      details: error.message
    });
  }
}