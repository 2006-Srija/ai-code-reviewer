import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout/Layout';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>AI Code Reviewer — Automate PR Reviews</title>
        <meta name="description" content="AI-powered code review for GitHub PRs. Catch bugs, security issues, and get fixes automatically." />
      </Head>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #eef2f6 100%)',
        padding: '5rem 0'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            lineHeight: '1.2',
            marginBottom: '1.5rem'
          }}>
            Automate Code Reviews <br />
            <span style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              with AI
            </span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#475569',
            maxWidth: '600px',
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            Catch bugs, security vulnerabilities, and style issues before they reach production.
            Your AI pair programmer that never sleeps.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/demo" className="btn" style={{ padding: '1rem 2rem' }}>
              Try Live Demo →
            </Link>
            <Link href="/pricing" className="btn btn-secondary" style={{ padding: '1rem 2rem' }}>
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container" style={{ padding: '5rem 0' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          Why developers love AI Reviewer
        </h2>

        <div className="grid">
          {[
            {
              icon: '🐛',
              title: 'Bug Detection',
              desc: 'Line-by-line analysis with fix suggestions. Catch null references, type coercion, and logic errors.'
            },
            {
              icon: '🔒',
              title: 'Security',
              desc: 'Detect SQL injection, XSS, eval() usage, and hardcoded secrets before they become vulnerabilities.'
            },
            {
              icon: '⚡',
              title: 'Performance',
              desc: 'Get optimization tips for loops, memory leaks, and inefficient patterns.'
            },
            {
              icon: '🎯',
              title: 'Best Practices',
              desc: 'Enforce code style, modern syntax, and avoid deprecated patterns.'
            },
            {
              icon: '📊',
              title: 'Quality Score',
              desc: 'Every PR gets a score from 0-100 with detailed breakdown of issues.'
            },
            {
              icon: '🚀',
              title: 'Instant Feedback',
              desc: 'Comments appear directly on your PR within seconds of creation.'
            }
          ].map((feature, i) => (
            <div key={i} className="card" style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{feature.title}</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: '#1e293b',
        color: 'white',
        padding: '4rem 0'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem' }}>
            Ready to ship better code?
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#94a3b8', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Join developers who catch issues before they reach production.
          </p>
          <Link href="/pricing" className="btn" style={{ padding: '1rem 2rem' }}>
            Get Started Now →
          </Link>
        </div>
      </section>
    </Layout>
  );
}