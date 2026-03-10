import Layout from '../../components/layout/Layout';

export default function Docs() {
  return (
    <Layout>
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>📚 Documentation</h1>
        
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Getting Started</h2>
          <ol style={{ lineHeight: '1.8' }}>
            <li>Login with GitHub</li>
            <li>Install our GitHub App</li>
            <li>Create a PR and see AI review!</li>
          </ol>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Features</h2>
          <ul style={{ lineHeight: '1.8' }}>
            <li>🔍 Automatic code review on every PR</li>
            <li>🐛 Bug detection with line numbers</li>
            <li>🔒 Security vulnerability scanning</li>
            <li>⚡ Performance optimization tips</li>
            <li>📊 Review dashboard with stats</li>
          </ul>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>API Reference</h2>
          
          <h3>POST /api/analyze</h3>
          <pre style={{ background: '#f6f8fa', padding: '15px', borderRadius: '8px' }}>
{`{
  "code": "function test() { return 1; }",
  "language": "javascript"
}`}
          </pre>

          <h3>Response</h3>
          <pre style={{ background: '#f6f8fa', padding: '15px', borderRadius: '8px' }}>
{`{
  "bugs": [{"line": 1, "message": "bug"}],
  "security": [],
  "score": 85
}`}
          </pre>
        </div>

        <div>
          <h2 style={{ fontSize: '24px', marginBottom: '15px' }}>Need Help?</h2>
          <p>Check our <a href="/docs/faq">FAQ</a> or <a href="/docs/support">Contact Support</a></p>
        </div>
      </div>
    </Layout>
  );
}"// Force rebuild docs" 
