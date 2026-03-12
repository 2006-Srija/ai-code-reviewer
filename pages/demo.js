import { useState } from 'react';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Demo() {
  const [code, setCode] = useState(`function calculateTotal(items) {
  let total = 0;
  for(var i=0; i<items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');

  const analyzeCode = async () => {
    setLoading(true);
    // Simulate faster response (remove in production)
    setTimeout(async () => {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language })
        });
        const data = await response.json();
        setReview(data);
      } catch (error) {
        setReview({
          bugs: [{ line: 1, message: 'Analysis failed' }],
          security: [],
          performance: [],
          suggestions: ['Try again'],
          score: 0
        });
      } finally {
        setLoading(false);
      }
    }, 800); // Fast feedback
  };

  return (
    <Layout>
      <div className="container" style={{ padding: '3rem 0' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Live AI Review
        </h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          Paste code below — AI analyzes and gives instant feedback.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left Panel */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <label style={{ fontWeight: '500' }}>Your Code</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} style={selectStyle}>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={textareaStyle}
            />
            <button
              onClick={analyzeCode}
              disabled={loading}
              className="btn"
              style={{ marginTop: '1rem', width: '100%' }}
            >
              {loading ? 'Analyzing...' : '🔍 Analyze with AI'}
            </button>
          </div>

          {/* Right Panel */}
          <div>
            <h3 style={{ fontWeight: '500', marginBottom: '1rem' }}>AI Review</h3>
            {loading ? (
              <SkeletonLoader />
            ) : review ? (
              <div className="card">
                <ScoreBadge score={review.score} />
                <IssueSection title="🐛 Bugs" items={review.bugs} color="#dc2626" />
                <IssueSection title="🔒 Security" items={review.security} color="#dc2626" />
                <IssueSection title="⚡ Performance" items={review.performance} color="#16a34a" />
                <SuggestionSection suggestions={review.suggestions} />
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Components
function ScoreBadge({ score }) {
  const color = score > 80 ? '#16a34a' : score > 50 ? '#ca8a04' : '#dc2626';
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span>Quality Score</span>
        <span style={{ fontWeight: '600', color }}>{score}%</span>
      </div>
      <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '3px' }} />
      </div>
    </div>
  );
}

function IssueSection({ title, items, color }) {
  if (!items?.length) return null;
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', color }}>{title}</h4>
      {items.map((item, i) => (
        <div key={i} style={issueItemStyle}>
          <span style={{ fontWeight: '500' }}>Line {item.line}:</span> {item.message}
        </div>
      ))}
    </div>
  );
}

function SuggestionSection({ suggestions }) {
  if (!suggestions?.length) return null;
  return (
    <div>
      <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', color: '#2563eb' }}>
        💡 Suggestions
      </h4>
      {suggestions.map((s, i) => (
        <div key={i} style={suggestionItemStyle}>
          {s}
        </div>
      ))}
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="card">
      {[1,2,3].map(i => (
        <div key={i} style={{ marginBottom: '1.5rem' }}>
          <div style={{ height: '20px', width: '40%', background: '#e2e8f0', borderRadius: '4px', marginBottom: '0.5rem' }} />
          <div style={{ height: '16px', width: '100%', background: '#f1f5f9', borderRadius: '4px' }} />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <p style={{ color: '#64748b' }}>Paste code and click analyze</p>
    </div>
  );
}

// Styles
const selectStyle = {
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  border: '1px solid #e2e8f0',
  background: 'white',
  fontSize: '0.875rem'
};

const textareaStyle = {
  width: '100%',
  height: '350px',
  fontFamily: 'monospace',
  fontSize: '14px',
  padding: '1rem',
  borderRadius: '0.75rem',
  border: '1px solid #e2e8f0',
  background: '#f8fafc',
  resize: 'vertical'
};

const issueItemStyle = {
  background: '#f8fafc',
  padding: '0.75rem',
  borderRadius: '0.5rem',
  marginBottom: '0.5rem',
  fontSize: '0.875rem',
  border: '1px solid #f1f5f9'
};

const suggestionItemStyle = {
  background: '#eff6ff',
  padding: '0.75rem',
  borderRadius: '0.5rem',
  marginBottom: '0.5rem',
  fontSize: '0.875rem',
  color: '#1e293b'
};