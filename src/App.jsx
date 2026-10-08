import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { fetchCurrentUser, checkAuth, logout } from './services/authService';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (checkAuth()) {
        try {
          await fetchCurrentUser();
        } catch (err) {
          // fetchCurrentUser will throw if 401, logout to clear state
          await logout();
        }
      }
      setIsInitializing(false);
    };
    
    const applySettings = () => {
      try {
        const stored = localStorage.getItem('cs_settings');
        if (stored) {
          const s = JSON.parse(stored);
          if (s.denseLayout) {
            document.body.classList.add('dense-layout');
          } else {
            document.body.classList.remove('dense-layout');
          }
          if (s.theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
          } else if (s.theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
          } else {
            document.documentElement.removeAttribute('data-theme');
          }
        }
      } catch (e) { }
    };
    
    applySettings();
    initAuth();
  }, []);

  if (isInitializing) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)' }}>
        <div style={{ color: 'var(--text-muted)' }}>Initializing...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
