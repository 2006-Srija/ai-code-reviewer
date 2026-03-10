export default function handler(req, res) {
  const { code } = req.query;
  console.log('Auth callback with code:', code);
  
  // For now, just redirect to dashboard
  res.redirect('/dashboard?token=mock_token_123');
}