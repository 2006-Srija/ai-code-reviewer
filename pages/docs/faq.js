import Layout from '../../components/layout/Layout';

export default function FAQ() {
  return (
    <Layout>
      <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '20px' }}>❓ Frequently Asked Questions</h1>
        
        <div style={{ marginBottom: '30px' }}>
          <h3>How does the AI review work?</h3>
          <p>We use CodeLlama 7B locally on your machine - your code never leaves your computer!</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3>Is my code secure?</h3>
          <p>Yes! All analysis happens locally. We never send your code to any external servers.</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3>What languages are supported?</h3>
          <p>JavaScript, TypeScript, Python, Java, C++, Go, Ruby, PHP, and more!</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3>How much does it cost?</h3>
          <p>Free tier: 100 reviews/month. Pro: $19/month for unlimited reviews.</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3>Can I use it with private repos?</h3>
          <p>Yes! Pro and Enterprise plans support private repositories.</p>
        </div>
      </div>
    </Layout>
  );
}