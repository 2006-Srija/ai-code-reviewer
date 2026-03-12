import Layout from '../components/layout/Layout';

export default function Contact() {
  return (
    <Layout>
      <div className="container" style={{ padding: '3rem 0', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Contact Us</h1>
        
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>📧 Email</h3>
          <p><a href="mailto:support@aicodereviewer.com">support@aicodereviewer.com</a></p>
        </div>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>💬 Discord</h3>
          <p>Join our community for help and discussions</p>
          <button className="btn">Join Discord</button>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>🐛 Report a Bug</h3>
          <p>Found an issue? Let us know on GitHub</p>
          <a href="https://github.com/2006-Srija/ai-code-reviewer/issues" className="btn btn-secondary">Open Issue</a>
        </div>
      </div>
    </Layout>
  );
}