import { exec } from 'child_process';
import { promisify } from 'util';

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
    // Write code to a temporary file to avoid escaping issues
    const fs = await import('fs');
    const path = await import('path');
    const os = await import('os');
    
    const tempDir = os.tmpdir();
    const tempCodePath = path.join(tempDir, `athena_code_${Date.now()}.txt`);
    fs.writeFileSync(tempCodePath, code, 'utf8');

    const { stdout, stderr } = await execAsync(
      `python agents/athena.py --code-file "${tempCodePath}" --file "${filename}"`,
      { timeout: 60000 }
    );

    // Clean up temp file
    fs.unlinkSync(tempCodePath);

    if (stderr && !stderr.includes('Warning') && !stderr.includes('Loading')) {
      console.error('Python stderr:', stderr);
    }

    const review = JSON.parse(stdout);
    res.status(200).json(review);

  } catch (error) {
    console.error('Athena error:', error);
    res.status(500).json({ error: 'Review failed', details: error.message });
  }
}