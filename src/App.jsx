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
          } else if (s.theme === 'midnight') {
            document.documentElement.setAttribute('data-theme', 'midnight');
          } else if (s.theme === 'neon') {
            document.documentElement.setAttribute('data-theme', 'neon');
          } else {
            document.documentElement.removeAttribute('data-theme');
          }
        }
      } catch (err) {
        console.error('Failed to load settings', err);
      }
    };
    
    applySettings();
    initAuth();
  }, []);

  if (isInitializing) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-canvas)', gap: '16px' }}>
        <div style={{ animation: 'pulseGlow 1.5s infinite ease-in-out', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--brand-subtle)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-color)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.5px' }}>CyberSentinel</div>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Securing operations workspace...</div>
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
