import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
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
    } else if (status !== 'loading') {
      window.location.href = '/api/auth/signin';
    }
  }, [session, status]);

  async function fetchDashboardData() {
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        fetch('/api/user/reviews'),
        fetch('/api/user/stats')
      ]);
      
      const reviewsData = await reviewsRes.json();
      const statsData = await statsRes.json();
      
      setReviews(reviewsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (status === 'loading' || loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="container" style={{ padding: '2rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Dashboard</h1>
          {session?.user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#64748b' }}>{session.user.name}</span>
              <img src={session.user.image} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            </div>
          )}
        </div>

        {stats && (
          <div className="grid" style={{ marginBottom: '3rem' }}>
            <div className="card">
              <h3 style={{ fontSize: '1rem', color: '#64748b' }}>Total PRs</h3>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#2563eb' }}>{stats.totalPRs}</p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '1rem', color: '#64748b' }}>Bugs Found</h3>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#dc2626' }}>{stats.totalBugs}</p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '1rem', color: '#64748b' }}>Avg Score</h3>
              <p style={{ fontSize: '2rem', fontWeight: '700', color: '#16a34a' }}>{stats.avgScore}%</p>
            </div>
          </div>
        )}

        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>Recent PR Reviews</h2>

        {reviews.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>No reviews yet. Create a PR to get started!</p>
            <Link href="/docs" className="btn btn-secondary">Learn how →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {reviews.map((review) => (
              <div key={review.createdAt} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{review.repo} #{review.prNumber}</h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    background: review.score > 80 ? '#dcfce7' : review.score > 50 ? '#fef9c3' : '#fee2e2',
                    color: review.score > 80 ? '#166534' : review.score > 50 ? '#854d0e' : '#991b1b',
                  }}>
                    Score: {review.score}%
                  </span>
                </div>
                <p style={{ marginTop: '1rem', color: '#475569' }}>
                  Issues: {review.bugs?.length || 0} bugs, {review.security?.length || 0} security, {review.performance?.length || 0} performance
                </p>
                <Link href={`/dashboard/${review.createdAt}`} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}