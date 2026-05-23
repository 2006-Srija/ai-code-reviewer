import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';

export default function AthenaDashboard() {
  const [stats, setStats] = useState({
    totalReviews: 0,
    avgScore: 0,
    totalIssues: 0,
    bySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
    byAgent: {}
  });
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      const response = await fetch('/api/athena/stats');
      const data = await response.json();
      setStats(data.stats);
      setRecentReviews(data.recent);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  const agents = [
    { name: 'Security', icon: '🔒', color: '#dc2626', description: 'SQL injection, XSS, eval(), hardcoded secrets' },
    { name: 'Performance', icon: '⚡', color: '#f59e0b', description: 'N+1 queries, memory leaks, inefficient loops' },
    { name: 'Quality', icon: '📊', color: '#10b981', description: 'var usage, ===, semicolons, console logs' },
    { name: 'Architecture', icon: '🏗️', color: '#8b5cf6', description: 'Circular deps, coupling, SOLID violations' },
    { name: 'Dependency', icon: '📦', color: '#3b82f6', description: 'Outdated packages, vulnerabilities, licenses' },
    { name: 'Test', icon: '🧪', color: '#14b8a6', description: 'Missing tests, coverage gaps, test anti-patterns' },
    { name: 'Secret', icon: '🔐', color: '#ef4444', description: 'API keys, tokens, passwords, credentials' },
    { name: 'Bug', icon: '🐛', color: '#f97316', description: 'Null pointer, race conditions, type coercion' }
  ];

  return (
    <Layout>
      <div className="container" style={{ padding: '2rem 0' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            🦉 Athena Intelligence Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
            Multi-Agent Code Review Platform — Production Grade
          </p>
        </div>

        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <StatCard title="Total PRs Reviewed" value={stats.totalReviews} icon="📊" />
          <StatCard title="Avg Quality Score" value={`${stats.avgScore}%`} icon="⭐" color="#10b981" />
          <StatCard title="Issues Found" value={stats.totalIssues} icon="🐛" color="#dc2626" />
          <StatCard title="Active Agents" value="8" icon="🤖" color="#8b5cf6" />
        </div>

        {/* Severity Breakdown */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Issue Severity Breakdown</h2>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <SeverityBar label="Critical" value={stats.bySeverity?.critical || 0} color="#dc2626" />
            <SeverityBar label="High" value={stats.bySeverity?.high || 0} color="#f97316" />
            <SeverityBar label="Medium" value={stats.bySeverity?.medium || 0} color="#f59e0b" />
            <SeverityBar label="Low" value={stats.bySeverity?.low || 0} color="#10b981" />
          </div>
        </div>

        {/* Agent Grid */}
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🤖 Specialized Agents</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {agents.map((agent, i) => (
            <AgentCard key={i} agent={agent} />
          ))}
        </div>

        {/* Recent Reviews */}
        <div className="card">
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Recent Reviews</h2>
          {loading ? (
            <p>Loading...</p>
          ) : recentReviews.length === 0 ? (
            <p>No reviews yet. Create a PR to see results.</p>
          ) : (
            recentReviews.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <h3 style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ fontSize: '2rem', fontWeight: '700', color: color || '#2563eb' }}>{value}</p>
    </div>
  );
}

function SeverityBar({ label, value, color }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
        <span style={{ fontWeight: '500', color }}>{label}</span>
        <span>{value}</span>
      </div>
      <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px' }}>
        <div style={{ width: `${Math.min(value * 2, 100)}%`, height: '100%', background: color, borderRadius: '4px' }} />
      </div>
    </div>
  );
}

function AgentCard({ agent }) {
  return (
    <div className="card" style={{ borderLeft: `4px solid ${agent.color}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.5rem' }}>{agent.icon}</span>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{agent.name} Agent</h3>
      </div>
      <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{agent.description}</p>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div style={{
      borderBottom: '1px solid #e2e8f0',
      padding: '1rem 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <div>
        <span style={{ fontWeight: '600' }}>{review.repo}#{review.prNumber}</span>
        <span style={{ fontSize: '0.875rem', color: '#64748b', marginLeft: '1rem' }}>
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{
          padding: '0.25rem 0.5rem',
          borderRadius: '1rem',
          background: review.score > 80 ? '#dcfce7' : review.score > 60 ? '#fef9c3' : '#fee2e2',
          color: review.score > 80 ? '#166534' : review.score > 60 ? '#854d0e' : '#991b1b'
        }}>
          Score: {review.score}
        </span>
        <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem' }}>Details</button>
      </div>
    </div>
  );
}