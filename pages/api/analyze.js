import { reviewCode } from '../../lib/ai/reviewer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, language } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    console.log('📝 Analyzing code...');
    const review = await reviewCode(code, `file.${language || 'js'}`);
    
    // Add cache headers
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).json(review);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Analysis failed',
      bugs: [],
      security: [],
      performance: [],
      suggestions: ['Server error, please try again'],
      score: 0
    });
  }
}