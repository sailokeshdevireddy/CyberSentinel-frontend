import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { Shield, Building, User, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const Register = () => {
  const [formData, setFormData] = useState({ 
    organizationName: '', 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      if (err.code) {
        setError(err.message || 'Registration failed');
      } else {
        setError('An unexpected error occurred');
      }
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: 'radial-gradient(ellipse at 50% 20%, var(--bg-secondary) 0%, var(--bg-canvas) 70%)',
        padding: '24px' 
      }}>
        <div style={{ 
          background: 'var(--bg-secondary)', 
          padding: '40px 32px', 
          borderRadius: 'var(--radius-xl)', 
          width: '100%', 
          maxWidth: '440px', 
          border: '1px solid var(--border-color)', 
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: 'var(--status-success-bg)', 
            border: '1px solid var(--status-success-border)',
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--status-success)',
            marginBottom: '20px'
          }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>
            Registration Successful
          </h2>
          <p className="text-muted" style={{ fontSize: '0.875rem', lineHeight: 1.5, margin: '0 0 20px' }}>
            Your organization enclave and administrative credentials have been created. Redirecting to login...
          </p>
          <div style={{ display: 'inline-block', width: '32px', height: '4px', borderRadius: '2px', background: 'var(--status-success)' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'radial-gradient(ellipse at 50% 20%, var(--bg-secondary) 0%, var(--bg-canvas) 70%)',
      padding: '32px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Grid */}
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
        maxWidth: '440px', 
        border: '1px solid var(--border-color)', 
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        zIndex: 10,
        animation: 'modalScaleIn 250ms ease-out'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            width: '52px', 
            height: '52px', 
            borderRadius: 'var(--radius-lg)', 
            background: 'var(--brand-subtle)', 
            border: '1px solid var(--brand-glow)', 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--brand-color)',
            boxShadow: '0 0 20px var(--brand-glow)',
            marginBottom: '14px'
          }}>
            <Shield size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
            Register Organization Enclave
          </h2>
          <p className="text-muted" style={{ marginTop: '6px', fontSize: '0.85rem' }}>
            Provision a multi-tenant workspace with administrative access
          </p>
        </div>
        
        {error && (
          <div style={{ 
            background: 'var(--status-critical-bg)', 
            border: '1px solid var(--status-critical-border)',
            color: 'var(--status-critical)', 
            padding: '12px 14px', 
            borderRadius: 'var(--radius-md)', 
            marginBottom: '18px', 
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Organization / Company Name
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Building size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                required 
                placeholder="e.g. Acme Security Corp"
                value={formData.organizationName}
                onChange={e => setFormData({...formData, organizationName: e.target.value})}
                className="form-control"
                style={{ width: '100%', paddingLeft: '38px', height: '40px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Admin Operator Name
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                required 
                placeholder="Full Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="form-control"
                style={{ width: '100%', paddingLeft: '38px', height: '40px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Work Email Address
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                required 
                placeholder="admin@organization.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="form-control"
                style={{ width: '100%', paddingLeft: '38px', height: '40px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Passphrase
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                required 
                placeholder="Create robust passphrase"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="form-control"
                style={{ width: '100%', paddingLeft: '38px', height: '40px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Confirm Passphrase
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                required 
                placeholder="Confirm passphrase"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                className="form-control"
                style={{ width: '100%', paddingLeft: '38px', height: '40px' }}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading} 
            loading={loading}
            style={{ width: '100%', height: '44px', marginTop: '10px', fontSize: '0.925rem' }}
          >
            {loading ? 'Provisioning Tenant...' : 'Complete Registration'}
            {!loading && <ArrowRight size={16} style={{ marginLeft: '4px' }} />}
          </Button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '22px', fontSize: '0.85rem' }}>
          <span className="text-muted">Already registered? </span>
          <Link to="/login" style={{ color: 'var(--brand-color)', textDecoration: 'none', fontWeight: 600 }}>
            Sign In to Workspace
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;