import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem('github_token');
    
    // Check for token in URL (from OAuth callback)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    
    if (urlToken) {
      localStorage.setItem('github_token', urlToken);
      setUser({ token: urlToken });
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (token) {
      setUser({ token });
    }
    
    setLoading(false);
  }, []);

  const login = () => {
    window.location.href = '/api/auth/github';
  };

  const logout = () => {
    localStorage.removeItem('github_token');
    setUser(null);
  };

  return { user, loading, login, logout };
}