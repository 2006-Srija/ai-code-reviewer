import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  async function fetchDashboardData() {
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        fetch('/api/user/reviews'),
        fetch('/api/user/stats')
      ]);
      
      const reviewsData = await reviewsRes.json();
      const statsData = await statsRes.json();
      
      console.log('📚 Reviews from DynamoDB:', reviewsData); // Debug log
      setReviews(reviewsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (status === 'loading' || loading) return <LoadingSpinner />;
  
  if (!session) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h1>Please Login</h1>
          <p>You need to be logged in to view your dashboard.</p>
          <a href="/api/auth/signin" style={{
            background: '#2ea44f',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            display: 'inline-block',
            marginTop: '20px'
          }}>
            Login with GitHub
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>📊 Welcome, {session.user.name}</h1>
          <img 
            src={session.user.image} 
            alt="Profile" 
            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
          />
        </div>

        {/* Stats Cards */}
        {stats && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            margin: '30px 0'
          }}>
            <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
              <h3>Total PRs</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalPRs || 0}</p>
            </div>
            <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
              <h3>Bugs Found</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.totalBugs || 0}</p>
            </div>
            <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
              <h3>Avg Score</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.avgScore || 0}%</p>
            </div>
            <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
              <h3>Usage</h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.used || 0}/{stats.limit || 100}</p>
            </div>
          </div>
        )}

        {/* Recent Reviews */}
        <h2>Recent PR Reviews</h2>
        {reviews.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '8px' }}>
            No reviews yet. Connect a GitHub repo to get started!
          </p>
        ) : (
          <div style={{ marginTop: '20px' }}>
            {reviews.map(review => {
              console.log('🔍 Rendering review:', review); // Debug log
              return (
                <div key={review.createdAt} style={{
                  border: '1px solid #e1e4e8',
                  borderRadius: '8px',
                  padding: '20px',
                  margin: '10px 0',
                  background: 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3>{review.repo}#{review.prNumber}</h3>
                    <span style={{
                      background: review.score > 80 ? '#2ea44f' : review.score > 60 ? '#f9c513' : '#cb2431',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px'
                    }}>
                      Score: {review.score}%
                    </span>
                  </div>
                  <p>Issues: {review.bugs?.length || 0}</p>
                  <button 
                    onClick={() => window.location.href = `/dashboard/${review.createdAt}`}
                    style={{
                      background: '#0366d6',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    View Details →
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}"// Force rebuild dashboard" 
