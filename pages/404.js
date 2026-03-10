import Link from 'next/link';
import Layout from '../components/layout/Layout';

export default function Custom404() {
  return (
    <Layout>
      <div style={{
        textAlign: 'center',
        padding: '80px 20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h1 style={{ fontSize: '80px', marginBottom: '20px', color: '#0366d6' }}>404</h1>
        <h2 style={{ marginBottom: '20px' }}>Page Not Found</h2>
        <p style={{ marginBottom: '30px', color: '#666' }}>
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link href="/" style={{
          background: '#0366d6',
          color: 'white',
          padding: '12px 30px',
          borderRadius: '6px',
          textDecoration: 'none',
          display: 'inline-block',
          fontSize: '16px'
        }}>
          ← Go Back Home
        </Link>
      </div>
    </Layout>
  );
}// 404 Page 
