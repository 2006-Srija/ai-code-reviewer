import { useEffect } from 'react';

export function useKeyboard(shortcuts) {
  useEffect(() => {
    const handler = (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        shortcuts.search?.();
      }
      
      // ? for help
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        shortcuts.help?.();
      }
      
      // Escape for close
      if (e.key === 'Escape') {
        shortcuts.escape?.();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
}