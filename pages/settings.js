import Layout from '../components/layout/Layout';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Settings() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('profile');

  const handleUpgrade = async () => {
    if (!session) return;
    try {
      const stripe = await stripePromise;
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: 'price_1T8DrgK4pbczNClLKiT9Jv3o',
          userId: session.user.id 
        })
      });
      const { sessionId } = await response.json();
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Upgrade failed:', error);
    }
  };

  return (
    <Layout>
      <div style={{
        display: 'flex',
        minHeight: 'calc(100vh - 70px)',
        background: '#f8fafc'
      }}>
        {/* Settings Sidebar */}
        <div style={{
          width: '280px',
          background: 'white',
          borderRight: '1px solid #f1f5f9',
          padding: '2rem 1rem'
        }}>
          <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
            <h3 style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>ACCOUNT</h3>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                ...tabButtonStyle,
                background: activeTab === 'profile' ? '#f1f5f9' : 'transparent',
                fontWeight: activeTab === 'profile' ? '600' : '400'
              }}
            >
              👤 Profile
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              style={{
                ...tabButtonStyle,
                background: activeTab === 'billing' ? '#f1f5f9' : 'transparent',
                fontWeight: activeTab === 'billing' ? '600' : '400'
              }}
            >
              💳 Billing
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              style={{
                ...tabButtonStyle,
                background: activeTab === 'integrations' ? '#f1f5f9' : 'transparent',
                fontWeight: activeTab === 'integrations' ? '600' : '400'
              }}
            >
              🔌 Integrations
            </button>
          </div>

          <div style={{ padding: '0 1rem' }}>
            <h3 style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>WORKSPACE</h3>
            <button
              onClick={() => setActiveTab('team')}
              style={{
                ...tabButtonStyle,
                background: activeTab === 'team' ? '#f1f5f9' : 'transparent',
                fontWeight: activeTab === 'team' ? '600' : '400'
              }}
            >
              👥 Team
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              style={{
                ...tabButtonStyle,
                background: activeTab === 'notifications' ? '#f1f5f9' : 'transparent',
                fontWeight: activeTab === 'notifications' ? '600' : '400'
              }}
            >
              🔔 Notifications
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: '2rem' }}>
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Profile</h2>
              <div className="card" style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem' }}>
                  <img 
                    src={session?.user?.image} 
                    alt="avatar" 
                    style={{ width: '80px', height: '80px', borderRadius: '50%' }}
                  />
                  <div>
                    <p style={{ fontSize: '1.125rem', fontWeight: '600' }}>{session?.user?.name}</p>
                    <p style={{ color: '#64748b' }}>{session?.user?.email}</p>
                  </div>
                </div>
                <button className="btn btn-secondary">Change Avatar</button>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Billing</h2>
              <div className="card" style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <p style={{ fontWeight: '600' }}>Current Plan</p>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Free</p>
                  </div>
                  <button onClick={handleUpgrade} className="btn">Upgrade to Pro →</button>
                </div>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem' }}>
                  <p style={{ fontSize: '0.875rem', color: '#64748b' }}>No payment history</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Integrations</h2>
              <div className="card" style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: '600' }}>GitHub</p>
                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Connected</p>
                  </div>
                  <button className="btn btn-secondary">Re-sync</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Team</h2>
              <div className="card" style={{ maxWidth: '600px' }}>
                <p style={{ color: '#64748b' }}>No team members yet.</p>
                <button className="btn btn-secondary" style={{ marginTop: '1rem' }}>Invite Member</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Notifications</h2>
              <div className="card" style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span>Email notifications</span>
                  <input type="checkbox" defaultChecked />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>PR comment alerts</span>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const tabButtonStyle = {
  width: '100%',
  textAlign: 'left',
  padding: '0.75rem 1rem',
  border: 'none',
  borderRadius: '0.5rem',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: '0.95rem',
  color: '#1e293b',
  marginBottom: '0.25rem',
  transition: 'all 0.2s ease'
};