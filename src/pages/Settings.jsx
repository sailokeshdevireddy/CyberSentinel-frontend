import React, { useState, useEffect } from 'react';
import { getUser, updateCurrentUser } from '../services/authService';
import { getOrganizationById } from '../services/organizationService';
import { getSettings, saveSettings } from '../services/settingsService';
import apiClient from '../utils/apiClient';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import StatusBadge from '../components/ui/StatusBadge';
import Button from '../components/ui/Button';
import { 
  Save, 
  User, 
  Building, 
  Shield, 
  Bell, 
  Layout, 
  Check, 
  Monitor, 
  Moon, 
  Sun, 
  Sparkles, 
  CheckCircle2, 
  Key,
  Lock
} from 'lucide-react';
import './Settings.css';

const THEMES = [
  {
    id: 'system',
    name: 'System Default',
    description: 'Auto-adapts to your OS appearance',
    icon: Monitor,
    palette: ['#0f141c', '#3b82f6', '#f8fafc']
  },
  {
    id: 'dark',
    name: 'Enterprise Dark',
    description: 'Professional charcoal cybersecurity canvas',
    icon: Moon,
    palette: ['#090c10', '#161d28', '#3b82f6']
  },
  {
    id: 'light',
    name: 'Clean Light',
    description: 'High-contrast light interface',
    icon: Sun,
    palette: ['#f8fafc', '#ffffff', '#0284c7']
  },
  {
    id: 'midnight',
    name: 'Midnight Blue',
    description: 'Deep oceanic SOC with sky-blue accents',
    icon: Sparkles,
    palette: ['#060b16', '#101c3d', '#38bdf8']
  },
  {
    id: 'neon',
    name: 'Cyber Neon',
    description: 'High-tech dark canvas with cyan matrix glow',
    icon: Sparkles,
    palette: ['#05070d', '#0f172a', '#06b6d4']
  }
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  
  const [user, setUser] = useState(null);
  const [org, setOrg] = useState(null);
  const [settings, setSettings] = useState(null);
  
  // Track name changes
  const [editName, setEditName] = useState('');

  // Password state
  const [pwd, setPwd] = useState({ current: '', new: '', confirm: '' });
  const [pwdStatus, setPwdStatus] = useState({ message: '', error: false });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const currentUser = getUser();
        setUser(currentUser);
        setEditName(currentUser?.name || '');
        
        if (currentUser && currentUser.organizationId) {
          const orgRes = await getOrganizationById(currentUser.organizationId);
          if (orgRes.success) setOrg(orgRes.data);
        }
        
        const settingsRes = await getSettings();
        if (settingsRes.success) setSettings(settingsRes.data);
      } catch (err) {
        setError('Failed to load settings configuration.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const applyUISettings = (s) => {
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
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Save Name if changed
      if (editName.trim() !== '' && editName !== user?.name) {
        await updateCurrentUser({ name: editName });
        setUser(getUser()); // Refresh user state from cache
        window.dispatchEvent(new Event('auth-change'));
      }
      
      // Save Settings
      await saveSettings(settings);
      
      setToast('Settings saved successfully.');
      setTimeout(() => setToast(''), 3000);
    } catch (err) {
      setToast('Failed to save settings.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleNotifToggle = async (key) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleThemeSelect = async (themeId) => {
    const newSettings = { ...settings, theme: themeId };
    setSettings(newSettings);
    applyUISettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleDenseLayoutChange = async (e) => {
    const newSettings = { ...settings, denseLayout: e.target.checked };
    setSettings(newSettings);
    applyUISettings(newSettings);
    await saveSettings(newSettings);
  };

  const handleChangePassword = async () => {
    try {
      setPwdStatus({ message: 'Updating...', error: false });
      
      if (!pwd.current || !pwd.new || !pwd.confirm) {
        setPwdStatus({ message: 'All password fields are required.', error: true });
        return;
      }
      if (pwd.new !== pwd.confirm) {
        setPwdStatus({ message: 'New passwords do not match.', error: true });
        return;
      }
      
      await apiClient.patch('/api/auth/password', {
        currentPassword: pwd.current,
        newPassword: pwd.new,
        confirmPassword: pwd.confirm
      });
      
      setPwdStatus({ message: 'Password updated successfully.', error: false });
      setPwd({ current: '', new: '', confirm: '' });
      setTimeout(() => setPwdStatus({ message: '', error: false }), 4000);
    } catch (err) {
      const msg = err?.message || 'Failed to update password.';
      setPwdStatus({ message: msg, error: true });
    }
  };

  if (loading) return <Spinner message="Loading system settings..." />;
  if (error) return <ErrorState message={error} />;

  const isNameDirty = editName.trim() !== '' && editName !== user?.name;

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <div>
          <h1 className="page-title">Settings & Preferences</h1>
          <p className="page-subtitle">Configure theme appearance, user identity, tenant context, alerts, and credentials</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isNameDirty && (
            <span style={{ fontSize: '0.75rem', color: 'var(--status-medium)', fontWeight: 600 }}>
              • Unsaved profile changes
            </span>
          )}
          <Button onClick={handleSave} disabled={saving} loading={saving}>
            <Save size={16} style={{ marginRight: '6px' }} />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {toast && (
        <div className="settings-toast">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="settings-tabs">
        <button 
          className={`settings-tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
          onClick={() => setActiveTab('appearance')}
        >
          <Layout size={16} />
          Appearance & Themes
        </button>

        <button 
          className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={16} />
          Account Profile {isNameDirty && '●'}
        </button>

        <button 
          className={`settings-tab-btn ${activeTab === 'organization' ? 'active' : ''}`}
          onClick={() => setActiveTab('organization')}
        >
          <Building size={16} />
          Organization
        </button>

        <button 
          className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <Bell size={16} />
          Notifications
        </button>

        <button 
          className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield size={16} />
          Security & Access
        </button>
      </div>

      {/* TAB 1: APPEARANCE & THEMES */}
      {activeTab === 'appearance' && (
        <div className="settings-section-card">
          <div className="settings-card-header">
            <Layout size={18} style={{ color: 'var(--brand-color)' }} />
            <h3>Appearance & Display Themes</h3>
          </div>
          <div className="settings-card-body">
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                Interface Theme
              </label>
              <p className="text-muted" style={{ fontSize: '0.8rem', margin: '0 0 14px' }}>
                Select an interface palette optimized for security operations and telemetry clarity.
              </p>

              <div className="theme-picker-grid">
                {THEMES.map(t => {
                  const Icon = t.icon;
                  const isSelected = (settings?.theme || 'system') === t.id;
                  return (
                    <div 
                      key={t.id} 
                      className={`theme-card ${isSelected ? 'active' : ''}`}
                      onClick={() => handleThemeSelect(t.id)}
                    >
                      <div className="theme-preview-palette">
                        <div style={{ flex: 1, backgroundColor: t.palette[0] }}></div>
                        <div style={{ flex: 1, backgroundColor: t.palette[1] }}></div>
                        <div style={{ flex: 1, backgroundColor: t.palette[2] }}></div>
                      </div>
                      <div className="theme-card-info">
                        <div>
                          <div className="theme-card-title">
                            <Icon size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle', color: 'var(--brand-color)' }} />
                            {t.name}
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.description}</span>
                        </div>
                        {isSelected && <Check size={16} className="theme-check-icon" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <div className="toggle-switch-card">
                <div className="toggle-info">
                  <span className="toggle-title">High-Density Layout Mode</span>
                  <span className="toggle-description">
                    Reduces padding and table row spacing to display more telemetry rows simultaneously on high-resolution displays.
                  </span>
                </div>
                <label className="custom-switch">
                  <input 
                    type="checkbox" 
                    checked={!!settings?.denseLayout} 
                    onChange={handleDenseLayoutChange} 
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACCOUNT PROFILE */}
      {activeTab === 'profile' && (
        <div className="settings-section-card">
          <div className="settings-card-header">
            <User size={18} style={{ color: 'var(--brand-color)' }} />
            <h3>Operator Profile</h3>
          </div>
          <div className="settings-card-body">
            <div className="form-group">
              <label>Full Display Name</label>
              <input 
                type="text" 
                value={editName} 
                onChange={e => setEditName(e.target.value)} 
                className="form-control" 
                placeholder="Enter your full name"
                style={{ maxWidth: '480px' }}
              />
              <span className="text-muted" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                This name will appear on incident timeline audits and notes.
              </span>
            </div>

            <div className="form-group">
              <label>Registered Work Email</label>
              <input 
                type="text" 
                value={user?.email || ''} 
                readOnly 
                className="readonly-input" 
                style={{ maxWidth: '480px' }}
              />
              <span className="text-muted" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                Primary login identity (locked to organization domain).
              </span>
            </div>

            <div className="form-group">
              <label>Assigned Authorization Role</label>
              <div style={{ maxWidth: '480px' }}>
                <input 
                  type="text" 
                  value={user?.role || ''} 
                  readOnly 
                  className="readonly-input" 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORGANIZATION CONTEXT */}
      {activeTab === 'organization' && (
        <div className="settings-section-card">
          <div className="settings-card-header">
            <Building size={18} style={{ color: 'var(--brand-color)' }} />
            <h3>Organization Tenant Boundary</h3>
          </div>
          <div className="settings-card-body">
            <div className="form-group">
              <label>Organization Name</label>
              <input 
                type="text" 
                value={org?.name || 'N/A'} 
                readOnly 
                className="readonly-input" 
                style={{ maxWidth: '480px' }}
              />
            </div>

            <div className="form-group">
              <label>Tenant Organization Identifier</label>
              <input 
                type="text" 
                value={org?.id || 'N/A'} 
                readOnly 
                className="readonly-input" 
                style={{ maxWidth: '480px', fontFamily: 'var(--font-mono, monospace)' }}
              />
            </div>

            <div className="form-group">
              <label>Tenant Lifecycle Status</label>
              <div style={{ marginTop: '4px' }}>
                <StatusBadge status={org?.status || 'ACTIVE'} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="settings-section-card">
          <div className="settings-card-header">
            <Bell size={18} style={{ color: 'var(--brand-color)' }} />
            <h3>Security Alert & Notification Feeds</h3>
          </div>
          <div className="settings-card-body" style={{ gap: '12px' }}>
            <p className="text-muted" style={{ fontSize: '0.825rem', margin: '0 0 8px' }}>
              Select which platform triggers generate immediate in-app notifications in your top navigation center.
            </p>

            <div className="toggle-switch-card">
              <div className="toggle-info">
                <span className="toggle-title">Critical Threats Alert</span>
                <span className="toggle-description">
                  Notify immediately when automated correlation identifies a CRITICAL threat vector.
                </span>
              </div>
              <label className="custom-switch">
                <input 
                  type="checkbox" 
                  checked={!!settings?.notifications?.CRITICAL_THREAT} 
                  onChange={() => handleNotifToggle('CRITICAL_THREAT')} 
                />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="toggle-switch-card">
              <div className="toggle-info">
                <span className="toggle-title">Incident Created Alert</span>
                <span className="toggle-description">
                  Notify when any new security incident case is opened in your tenant scope.
                </span>
              </div>
              <label className="custom-switch">
                <input 
                  type="checkbox" 
                  checked={!!settings?.notifications?.INCIDENT_CREATED} 
                  onChange={() => handleNotifToggle('INCIDENT_CREATED')} 
                />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="toggle-switch-card">
              <div className="toggle-info">
                <span className="toggle-title">Incident Assignment</span>
                <span className="toggle-description">
                  Notify when a security incident investigation is specifically assigned to your user account.
                </span>
              </div>
              <label className="custom-switch">
                <input 
                  type="checkbox" 
                  checked={!!settings?.notifications?.INCIDENT_ASSIGNED} 
                  onChange={() => handleNotifToggle('INCIDENT_ASSIGNED')} 
                />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div className="toggle-switch-card">
              <div className="toggle-info">
                <span className="toggle-title">System & Infrastructure Alerts</span>
                <span className="toggle-description">
                  Notify on health checks, scheduled maintenance windows, and rule-engine state updates.
                </span>
              </div>
              <label className="custom-switch">
                <input 
                  type="checkbox" 
                  checked={!!settings?.notifications?.SYSTEM} 
                  onChange={() => handleNotifToggle('SYSTEM')} 
                />
                <span className="switch-slider"></span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SECURITY & CREDENTIALS */}
      {activeTab === 'security' && (
        <div className="settings-section-card">
          <div className="settings-card-header">
            <Lock size={18} style={{ color: 'var(--brand-color)' }} />
            <h3>Security & Password Management</h3>
          </div>
          <div className="settings-card-body" style={{ maxWidth: '480px' }}>
            <p className="text-muted" style={{ fontSize: '0.825rem', margin: '0 0 12px' }}>
              Ensure your account utilizes a resilient passphrase conforming to organizational security standards.
            </p>

            <div className="form-group">
              <label>Current Password</label>
              <input 
                type="password" 
                value={pwd.current} 
                onChange={e => setPwd({...pwd, current: e.target.value})} 
                className="form-control" 
                placeholder="Enter current password"
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                value={pwd.new} 
                onChange={e => setPwd({...pwd, new: e.target.value})} 
                className="form-control" 
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                value={pwd.confirm} 
                onChange={e => setPwd({...pwd, confirm: e.target.value})} 
                className="form-control" 
                placeholder="Re-enter new password"
              />
            </div>

            <div style={{ marginTop: '8px' }}>
              <Button variant="secondary" onClick={handleChangePassword}>
                <Key size={15} style={{ marginRight: '6px' }} /> Update Password
              </Button>
            </div>

            {pwdStatus.message && (
              <div style={{ 
                marginTop: '10px', 
                color: pwdStatus.error ? 'var(--status-critical)' : 'var(--status-success)', 
                fontSize: '0.85rem',
                fontWeight: 500,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: pwdStatus.error ? 'var(--status-critical-bg)' : 'var(--status-success-bg)',
                border: `1px solid ${pwdStatus.error ? 'var(--status-critical-border)' : 'var(--status-success-border)'}`
              }}>
                {pwdStatus.message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;