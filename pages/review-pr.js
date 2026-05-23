import { useState } from 'react';
import Layout from '../components/layout/Layout';

export default function ReviewPR() {
  const [prUrl, setPrUrl] = useState('');
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);

  const reviewPastPR = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/athena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prUrl })
      });
      const data = await response.json();
      setReview(data);
    } catch (error) {
      console.error('Review failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container" style={{ padding: '2rem' }}>
        <h1>Review Past PR</h1>
        <p>Enter any GitHub PR URL to get AI review</p>
        
        <input
          type="text"
          value={prUrl}
          onChange={(e) => setPrUrl(e.target.value)}
          placeholder="https://github.com/owner/repo/pull/123"
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }}
        />
        
        <button onClick={reviewPastPR} disabled={loading} className="btn">
          {loading ? 'Reviewing...' : '🔍 Review PR'}
        </button>
        
        {review && (
          <div className="card" style={{ marginTop: '2rem' }}>
            <h2>Review Results</h2>
            <p>Score: {review.score}/100</p>
            <p>Issues: {review.total_issues}</p>
            {review.findings?.map((f, i) => (
              <div key={i} style={{ borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
                <strong>[{f.agent}]</strong> {f.title} ({f.severity})
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}