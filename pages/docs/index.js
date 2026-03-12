import Layout from '../../components/layout/Layout';

export default function Docs() {
  return (
    <Layout>
      <div className="container" style={{ padding: '3rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Documentation</h1>
        
        <div className="grid">
          <div className="card">
            <h3>🚀 Getting Started</h3>
            <p>1. Install our GitHub App<br/>2. Create a PR<br/>3. Get AI review instantly</p>
          </div>
          
          <div className="card">
            <h3>🔧 API Reference</h3>
            <p>POST /api/analyze<br/>GET /api/health<br/>POST /api/webhook</p>
          </div>
          
          <div className="card">
            <h3>🎯 Features</h3>
            <p>• Bug detection<br/>• Security scanning<br/>• Performance tips</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}