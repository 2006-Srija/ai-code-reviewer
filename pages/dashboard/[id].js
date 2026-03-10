import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useSession } from 'next-auth/react';

export default function ReviewDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && session) {
      console.log('Looking for review with createdAt:', id);
      
      fetch(`/api/user/reviews`)
        .then(res => res.json())
        .then(reviews => {
          console.log('All reviews:', reviews);
          
          // Find the review by createdAt (which is the ID in URL)
          const found = reviews.find(r => r.createdAt === id);
          
          if (found) {
            console.log('Found review:', found);
            setReview(found);
          } else {
            console.log('No review found with createdAt:', id);
          }
          
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching review:', err);
          setLoading(false);
        });
    }
  }, [id, session]);

  if (!session) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h1>Please log in</h1>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Loading review details...</p>
        </div>
      </Layout>
    );
  }

  if (!review) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h1>Review not found</h1>
          <p>ID: {id}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            style={{
              background: '#0366d6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Go Back to Dashboard
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
        <button 
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            color: '#0366d6',
            cursor: 'pointer',
            fontSize: '16px',
            marginBottom: '20px'
          }}
        >
          ← Back to Dashboard
        </button>

        <h1>PR Review Details</h1>
        
        <div style={{ 
          background: '#f6f8fa', 
          padding: '30px', 
          borderRadius: '8px',
          border: '1px solid #e1e4e8'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h2>{review.repo} #{review.prNumber}</h2>
            <p style={{ color: '#586069' }}>
              Reviewed on {new Date(review.createdAt).toLocaleString()}
            </p>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            background: 'white',
            borderRadius: '8px',
            marginBottom: '30px'
          }}>
            <span style={{ fontSize: '18px' }}>Code Quality Score:</span>
            <span style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: review.score > 80 ? '#2ea44f' : review.score > 60 ? '#f9c513' : '#cb2431'
            }}>
              {review.score}%
            </span>
          </div>

          {review.bugs?.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#cb2431', marginBottom: '15px' }}>🐛 Bugs Found</h3>
              {review.bugs.map((bug, index) => (
                <div key={index} style={{
                  background: '#ffebe9',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <strong>Line {bug.line}:</strong> {bug.message}
                  {bug.fix && (
                    <div style={{ marginTop: '10px', color: '#586069' }}>
                      💡 <em>Fix: {bug.fix}</em>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {review.security?.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#cb2431', marginBottom: '15px' }}>🔒 Security Issues</h3>
              {review.security.map((sec, index) => (
                <div key={index} style={{
                  background: '#fff8c5',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <strong>Line {sec.line}:</strong> {sec.message}
                  {sec.fix && (
                    <div style={{ marginTop: '10px', color: '#586069' }}>
                      💡 <em>Fix: {sec.fix}</em>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {review.performance?.length > 0 && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#0a4', marginBottom: '15px' }}>⚡ Performance Tips</h3>
              {review.performance.map((perf, index) => (
                <div key={index} style={{
                  background: '#dafbe1',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  <strong>Line {perf.line}:</strong> {perf.message}
                  {perf.fix && (
                    <div style={{ marginTop: '10px', color: '#586069' }}>
                      💡 <em>Fix: {perf.fix}</em>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {review.suggestions?.length > 0 && (
            <div>
              <h3 style={{ color: '#0366d6', marginBottom: '15px' }}>💡 Suggestions</h3>
              {review.suggestions.map((suggestion, index) => (
                <div key={index} style={{
                  background: '#e3f2fd',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '10px'
                }}>
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}