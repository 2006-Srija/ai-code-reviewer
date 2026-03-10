import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useSession } from 'next-auth/react';

export default function Pricing() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleSubscribe = async (planName) => {
    try {
      if (!session && planName !== 'Free') {
        // Redirect to login if not authenticated (except for Free plan)
        window.location.href = '/api/auth/signin';
        return;
      }

      setLoading(true);
      setSelectedPlan(planName);

      // For Pro plan - create checkout session
      if (planName === 'Pro') {
        console.log('🔄 Creating checkout for Pro plan...');
        
        const response = await fetch('/api/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            priceId: 'price_1T8DrgK4pbczNClLKiT9Jv3o', // Your USD Price ID
            userId: session?.user?.id 
          })
        });

        const data = await response.json();
        console.log('📦 Checkout response:', data);
        
        if (!response.ok) {
          throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        // FIX: Use the URL directly from Stripe
        if (data.url) {
          console.log('✅ Redirecting to Stripe URL:', data.url);
          window.location.href = data.url;
        } else if (data.sessionId) {
          // Fallback to session ID format
          const checkoutUrl = `https://checkout.stripe.com/pay/${data.sessionId}`;
          console.log('🔗 Using fallback URL:', checkoutUrl);
          window.location.href = checkoutUrl;
        } else {
          throw new Error('No session ID or URL received');
        }
      } 
      // For Enterprise - redirect to contact form
      else if (planName === 'Enterprise') {
        window.location.href = 'mailto:sales@aicodereviewer.com?subject=Enterprise%20Inquiry';
      }
      // For Free - redirect to homepage
      else if (planName === 'Free') {
        window.location.href = '/';
      }

    } catch (error) {
      console.error('❌ Subscription error:', error);
      alert('Something went wrong: ' + error.message);
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: [
        'Public repos only',
        '100 reviews/month',
        'Basic analysis',
        'Community support'
      ],
      buttonText: 'Get Started',
      bgColor: '#f6f8fa',
      borderColor: '#e1e4e8'
    },
    {
      name: 'Pro',
      price: 19,
      features: [
        'Private repos',
        'Unlimited reviews',
        'Advanced security',
        'Priority support',
        'Team members (up to 5)'
      ],
      buttonText: 'Upgrade',
      bgColor: 'white',
      borderColor: '#0366d6',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: [
        'Self-hosted option',
        'SLA guarantee',
        'Custom AI models',
        '24/7 phone support',
        'SSO integration'
      ],
      buttonText: 'Contact Us',
      bgColor: '#f6f8fa',
      borderColor: '#e1e4e8'
    }
  ];

  const getButtonStyle = (plan) => {
    const baseStyle = {
      width: '100%',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: loading && selectedPlan === plan.name ? 'wait' : 'pointer',
      transition: 'all 0.2s',
      marginTop: '20px'
    };

    if (plan.name === 'Pro') {
      return {
        ...baseStyle,
        background: loading && selectedPlan === plan.name ? '#ccc' : '#2ea44f',
        color: 'white'
      };
    } else if (plan.name === 'Free') {
      return {
        ...baseStyle,
        background: '#0366d6',
        color: 'white'
      };
    } else {
      return {
        ...baseStyle,
        background: '#6f42c1',
        color: 'white'
      };
    }
  };

  return (
    <Layout>
      <div style={{ 
        padding: '60px 20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          fontSize: '48px', 
          marginBottom: '20px',
          color: '#24292e'
        }}>
          Simple, Transparent Pricing
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#586069', 
          fontSize: '18px', 
          marginBottom: '50px' 
        }}>
          Choose the plan that's right for you
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginTop: '20px'
        }}>
          {plans.map((plan, index) => (
            <div 
              key={index} 
              style={{
                border: `2px solid ${plan.borderColor}`,
                borderRadius: '12px',
                padding: '30px',
                background: plan.bgColor,
                position: 'relative',
                boxShadow: plan.popular ? '0 8px 30px rgba(3,102,214,0.1)' : '0 2px 8px rgba(0,0,0,0.02)',
                transform: plan.popular ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
            >
              {plan.popular && (
                <span style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#0366d6',
                  color: 'white',
                  padding: '4px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px'
                }}>
                  MOST POPULAR
                </span>
              )}
              
              <h2 style={{ 
                fontSize: '28px', 
                marginBottom: '15px',
                color: '#24292e'
              }}>
                {plan.name}
              </h2>
              
              <div style={{ marginBottom: '25px' }}>
                {typeof plan.price === 'number' ? (
                  <>
                    <span style={{ 
                      fontSize: '48px', 
                      fontWeight: 'bold',
                      color: '#24292e'
                    }}>
                      ${plan.price}
                    </span>
                    <span style={{ color: '#586069', marginLeft: '5px' }}>/month</span>
                  </>
                ) : (
                  <span style={{ 
                    fontSize: '36px', 
                    fontWeight: 'bold',
                    color: '#24292e'
                  }}>
                    {plan.price}
                  </span>
                )}
              </div>
              
              <ul style={{ 
                listStyle: 'none', 
                padding: 0, 
                margin: 0,
                minHeight: '200px'
              }}>
                {plan.features.map((feature, i) => (
                  <li 
                    key={i} 
                    style={{ 
                      marginBottom: '12px',
                      color: '#586069',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '15px'
                    }}
                  >
                    <span style={{ 
                      color: '#2ea44f', 
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe(plan.name)}
                disabled={loading && selectedPlan === plan.name}
                style={getButtonStyle(plan)}
              >
                {loading && selectedPlan === plan.name ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Processing...
                  </span>
                ) : (
                  plan.buttonText
                )}
              </button>
            </div>
          ))}
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        <div style={{
          marginTop: '60px',
          padding: '30px',
          background: '#f6f8fa',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '15px' }}>All plans include:</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <div>✅ GitHub integration</div>
            <div>✅ AI code analysis</div>
            <div>✅ PR webhooks</div>
            <div>✅ Email support</div>
            <div>✅ 14-day free trial</div>
            <div>✅ Cancel anytime</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}