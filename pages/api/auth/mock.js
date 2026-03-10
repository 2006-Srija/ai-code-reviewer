export default function handler(req, res) {
  // Mock login - redirect to dashboard with fake token
  console.log('Mock login called');
  res.redirect('/dashboard?token=mock_token_123');
}