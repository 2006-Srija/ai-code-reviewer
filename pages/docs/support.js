import Layout from '../../components/layout/Layout';

export default function Support() {
  return (
    <Layout>
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>🆘 Support</h1>
        
        <div style={{ marginBottom: '30px' }}>
          <h3>📧 Email Support</h3>
          <p><a href="mailto:support@aicodereviewer.com">support@aicodereviewer.com</a></p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3>💬 Discord Community</h3>
          <p>Join our Discord server for help from the community</p>
          <button style={{ background: '#5865F2', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px' }}>
            Join Discord
          </button>
        </div>

        <div>
          <h3>🐛 Report a Bug</h3>
          <p>Found an issue? Let us know on GitHub</p>
          <a href="https://github.com/2006-Srija/test-webhook/issues">Open an issue →</a>
        </div>
      </div>
    </Layout>
  );
}