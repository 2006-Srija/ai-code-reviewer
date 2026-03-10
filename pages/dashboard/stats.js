import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';

export default function Stats() {
  const [stats, setStats] = useState({
    totalPRs: 157,
    bugsFound: 342,
    securityIssues: 89,
    timeSaved: '28 hours',
    accuracy: '94%'
  });

  return (
    <Layout>
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '30px' }}>📊 AI Performance Stats</h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '25px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '30px',
            borderRadius: '15px',
            color: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: '18px', opacity: 0.9 }}>Total PRs Reviewed</h3>
            <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '10px 0' }}>{stats.totalPRs}</p>
            <p>↑ 23% from last month</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '30px',
            borderRadius: '15px',
            color: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: '18px', opacity: 0.9 }}>Bugs Found</h3>
            <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '10px 0' }}>{stats.bugsFound}</p>
            <p>⚠️ 12 critical bugs</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #5f2c82 0%, #49a09d 100%)',
            padding: '30px',
            borderRadius: '15px',
            color: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: '18px', opacity: 0.9 }}>Security Issues</h3>
            <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '10px 0' }}>{stats.securityIssues}</p>
            <p>🔒 All fixed</p>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            padding: '30px',
            borderRadius: '15px',
            color: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: '18px', opacity: 0.9 }}>Time Saved</h3>
            <p style={{ fontSize: '48px', fontWeight: 'bold', margin: '10px 0' }}>{stats.timeSaved}</p>
            <p>⏱️ For developers</p>
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
        }}>
          <h2>📈 Accuracy Over Time</h2>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '20px', marginTop: '30px' }}>
            {[65, 72, 78, 85, 89, 92, 94].map((value, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  height: `${value * 2}px`,
                  background: '#0366d6',
                  borderRadius: '8px 8px 0 0',
                  transition: 'height 0.3s'
                }} />
                <p style={{ marginTop: '10px' }}>Week {i+1}</p>
                <p style={{ fontWeight: 'bold' }}>{value}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}// Stats page 
