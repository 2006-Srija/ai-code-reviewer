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
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await response.json();
      setReview(data);
    } catch (error) {
      console.error('Analysis failed:', error);
      setReview({
        bugs: [{ line: 1, message: 'Error analyzing code' }],
        security: [],
        performance: [],
        suggestions: ['Try again with simpler code'],
        score: 0
      });
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>🎮 Live AI Code Review Demo</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Paste your code below and see real AI analysis using CodeLlama 7B
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Left side - Code input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontWeight: 'bold' }}>Your Code:</label>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{ padding: '5px', borderRadius: '4px' }}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                width: '100%',
                height: '400px',
                fontFamily: 'monospace',
                fontSize: '14px',
                padding: '15px',
                borderRadius: '8px',
                border: '2px solid #e1e4e8',
                backgroundColor: '#f6f8fa',
                resize: 'vertical'
              }}
            />
            <button
              onClick={analyzeCode}
              disabled={loading}
              style={{
                background: loading ? '#ccc' : '#2ea44f',
                color: 'white',
                padding: '12px 30px',
                border: 'none',
                borderRadius: '6px',
                marginTop: '15px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '100%'
              }}
            >
              {loading ? '🤖 AI Thinking...' : '🔍 Analyze with AI'}
            </button>
          </div>

          {/* Right side - AI Review */}
          <div>
            <h3 style={{ marginBottom: '15px' }}>🤖 AI Review Results:</h3>
            {loading ? (
              <LoadingSpinner />
            ) : review ? (
              <div style={{
                background: '#f6f8fa',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #e1e4e8'
              }}>
                {/* Score */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  padding: '15px',
                  background: 'white',
                  borderRadius: '8px'
                }}>
                  <span style={{ fontSize: '18px' }}>Code Quality Score:</span>
                  <span style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: review.score > 80 ? '#2ea44f' : review.score > 60 ? '#f9c513' : '#cb2431'
                  }}>
                    {review.score}%
                  </span>
                </div>

                {/* Bugs */}
                {review.bugs?.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#cb2431', marginBottom: '10px' }}>🐛 Bugs Found</h4>
                    {review.bugs.map((bug, i) => (
                      <div key={i} style={{ 
                        background: '#ffebe9', 
                        padding: '10px', 
                        borderRadius: '4px',
                        marginBottom: '5px'
                      }}>
                        <strong>Line {bug.line}:</strong> {bug.message}
                      </div>
                    ))}
                  </div>
                )}

                {/* Security */}
                {review.security?.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#cb2431', marginBottom: '10px' }}>🔒 Security Issues</h4>
                    {review.security.map((sec, i) => (
                      <div key={i} style={{ 
                        background: '#fff8c5', 
                        padding: '10px', 
                        borderRadius: '4px',
                        marginBottom: '5px'
                      }}>
                        <strong>Line {sec.line}:</strong> {sec.message}
                      </div>
                    ))}
                  </div>
                )}

                {/* Performance */}
                {review.performance?.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#0a4', marginBottom: '10px' }}>⚡ Performance Tips</h4>
                    {review.performance.map((perf, i) => (
                      <div key={i} style={{ 
                        background: '#dafbe1', 
                        padding: '10px', 
                        borderRadius: '4px',
                        marginBottom: '5px'
                      }}>
                        <strong>Line {perf.line}:</strong> {perf.message}
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                {review.suggestions?.length > 0 && (
                  <div>
                    <h4 style={{ color: '#0366d6', marginBottom: '10px' }}>💡 Suggestions</h4>
                    {review.suggestions.map((suggestion, i) => (
                      <div key={i} style={{ 
                        background: '#e3f2fd', 
                        padding: '10px', 
                        borderRadius: '4px',
                        marginBottom: '5px'
                      }}>
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                background: '#f6f8fa',
                padding: '40px',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#666'
              }}>
                <p style={{ fontSize: '18px' }}>👈 Paste your code and click analyze</p>
                <p>The AI will review it and show results here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}