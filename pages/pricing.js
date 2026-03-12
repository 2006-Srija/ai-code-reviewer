import Layout from '../components/layout/Layout';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Pricing() {
  const { data: session } = useSession();

  const handleProCheckout = async () => {
    if (!session) {
      window.location.href = '/api/auth/signin';
      return;
    }

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId: 'price_1T8DrgK4pbczNClLKiT9Jv3o',
          userId: session.user.id 
        })
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else if (data.sessionId) {
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: ['100 reviews/month', 'Public repos', 'Basic analysis'],
      cta: 'Get Started',
      action: () => window.location.href = '/',
      popular: false
    },
    {
      name: 'Pro',
      price: 19,
      features: ['Unlimited reviews', 'Private repos', 'Advanced security', 'Priority support'],
      cta: 'Upgrade',
      action: handleProCheckout,
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Self-hosted', 'SLA', 'Custom models', '24/7 support'],
      cta: 'Contact Us',
      action: () => window.location.href = 'mailto:sales@aicodereviewer.com?subject=Enterprise',
      popular: false
    }
  ];

  return (
    <Layout>
      <div className="container" style={{ padding: '3rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>
          Simple, Transparent Pricing
        </h1>

        <div className="grid">
          {plans.map((plan, i) => (
            <div key={i} className="card" style={{
              border: plan.popular ? '2px solid #2563eb' : '1px solid #f1f5f9',
              transform: plan.popular ? 'scale(1.05)' : 'none',
              position: 'relative'
            }}>
              {plan.popular && (
                <span style={{
                  background: '#2563eb',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}>
                  Most Popular
                </span>
              )}
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{plan.name}</h3>
              <p style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1.5rem' }}>
                {typeof plan.price === 'number' ? `$${plan.price}/mo` : plan.price}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ marginBottom: '0.75rem', color: '#475569' }}>
                    ✅ {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={plan.action}
                className={`btn ${plan.popular ? '' : 'btn-secondary'}`}
                style={{ width: '100%', cursor: 'pointer' }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}