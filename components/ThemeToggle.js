import { useState, useEffect } from 'react';

export default function ThemeToggle({ onToggle, isDark }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        padding: '0.75rem 1rem',
        background: 'none',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '1rem',
        color: '#1e293b'
      }}
    >
      <span style={{ fontSize: '1.25rem' }}>{isDark ? '☀️' : '🌙'}</span>
      <span>Theme: {isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}