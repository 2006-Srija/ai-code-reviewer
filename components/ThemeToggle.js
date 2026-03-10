import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.style.background = '#1a1a1a';
      document.body.style.color = '#ffffff';
    } else {
      document.body.style.background = '#ffffff';
      document.body.style.color = '#24292e';
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '12px',
        borderRadius: '50%',
        background: darkMode ? '#333' : '#f0f0f0',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 1000
      }}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
}