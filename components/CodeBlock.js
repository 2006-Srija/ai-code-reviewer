import { useState } from 'react';

export default function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      background: '#1e1e1e',
      borderRadius: '8px',
      margin: '20px 0',
      position: 'relative'
    }}>
      <div style={{
        padding: '10px 15px',
        background: '#2d2d2d',
        color: '#fff',
        borderRadius: '8px 8px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>{language}</span>
        <button
          onClick={copyCode}
          style={{
            background: copied ? '#28a745' : '#0366d6',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
      </div>
      <pre style={{
        padding: '15px',
        color: '#d4d4d4',
        overflow: 'auto',
        margin: 0
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}