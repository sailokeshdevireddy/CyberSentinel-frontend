import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { Shield, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const Login = () => {
  const [email, setEmail] = useState('admin@cybersentinel.local');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.code) {
        setError(err.message || 'Login failed');
      } else {
        setError('An unexpected error occurred');
      }
    }
    setLoading(false);
  };

  const handleUseDemoCredentials = () => {
    setEmail('admin@cybersentinel.local');
    setPassword('admin');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'radial-gradient(ellipse at 50% 20%, var(--bg-secondary) 0%, var(--bg-canvas) 70%)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle cybersecurity background grid lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        opacity: 0.15,
        pointerEvents: 'none'
      }}></div>

      <div style={{ 
        background: 'var(--bg-secondary)', 
        padding: '36px 32px', 
        borderRadius: 'var(--radius-xl)', 
        width: '100%', 
        maxWidth: '420px', 
        border: '1px solid var(--border-color)', 
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        zIndex: 10,
        animation: 'modalScaleIn 250ms ease-out'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: 'var(--radius-lg)', 
            background: 'var(--brand-subtle)', 
            border: '1px solid var(--brand-glow)', 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--brand-color)',
            boxShadow: '0 0 20px var(--brand-glow)',
            marginBottom: '16px'
          }}>
            <Shield size={30} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            CyberSentinel
          </h2>
          <p className="text-muted" style={{ marginTop: '6px', fontSize: '0.875rem' }}>
            Enterprise Security Operations Access
          </p>
        </div>
        
        {error && (
          <div style={{ 
            background: 'var(--status-critical-bg)', 
            border: '1px solid var(--status-critical-border)',
            color: 'var(--status-critical)', 
            padding: '12px 14px', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '20px', 
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Work Email
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-control"
                style={{ width: '100%', paddingLeft: '38px', paddingRight: '12px', height: '42px' }}
                placeholder="operator@organization.com"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Passphrase
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-control"
                style={{ width: '100%', paddingLeft: '38px', paddingRight: '12px', height: '42px' }}
                placeholder="Enter passphrase"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading} 
            loading={loading}
            style={{ width: '100%', height: '44px', marginTop: '6px', fontSize: '0.925rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            {!loading && <ArrowRight size={16} style={{ marginLeft: '4px' }} />}
          </Button>
        </form>

        {/* Demo Credentials Helper */}
        <div style={{
          marginTop: '20px',
          padding: '10px 14px',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--border-color)',
          fontSize: '0.775rem',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <strong style={{ color: 'var(--text-secondary)', display: 'block' }}>Demo Credentials:</strong>
            <code>admin@cybersentinel.local</code>
          </div>
          <button
            type="button"
            onClick={handleUseDemoCredentials}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--brand-color)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Auto-fill
          </button>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem' }}>
          <span className="text-muted">Need a tenant account? </span>
          <Link to="/register" style={{ color: 'var(--brand-color)', textDecoration: 'none', fontWeight: 600 }}>
            Register Organization
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;