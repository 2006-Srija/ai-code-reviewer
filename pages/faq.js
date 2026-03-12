import Layout from '../components/layout/Layout';

export default function FAQ() {
  const faqs = [
    { q: "How does the AI review work?", a: "We use CodeLlama 7B locally - your code never leaves your machine." },
    { q: "What languages are supported?", a: "JavaScript, TypeScript, Python, Java, C++, Go, Ruby, PHP, and more." },
    { q: "Is my code secure?", a: "100%! All analysis happens locally. No data is sent to external servers." },
    { q: "Can I use it with private repos?", a: "Yes! Pro plan supports private repositories." },
    { q: "How much does it cost?", a: "Free tier: 100 reviews/month. Pro: $19/month for unlimited." }
  ];

  return (
    <Layout>
      <div className="container" style={{ padding: '3rem 0', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Frequently Asked Questions</h1>
        {faqs.map((item, i) => (
          <div key={i} className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginBottom: '0.5rem', color: '#2563eb' }}>{item.q}</h3>
            <p style={{ color: '#475569' }}>{item.a}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}