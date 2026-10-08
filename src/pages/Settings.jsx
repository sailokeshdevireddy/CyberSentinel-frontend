import React, { useState, useEffect } from 'react';
import { getUser, updateCurrentUser } from '../services/authService';
import { getOrganizationById } from '../services/organizationService';
import { getSettings, saveSettings } from '../services/settingsService';
import Spinner from '../components/ui/Spinner';
import ErrorState from '../components/ui/ErrorState';
import { Save, User, Building, Shield, Bell, Layout } from 'lucide-react';
import './Settings.css';

const Settings = () => {
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
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Save Name if changed
      if (editName.trim() !== '' && editName !== user.name) {
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

  const handleThemeChange = async (e) => {
    const newSettings = { ...settings, theme: e.target.value };
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
      
      const apiClient = (await import('../utils/apiClient')).default;
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

  if (loading) return <Spinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h2>Settings</h2>
          <p className="text-muted">Manage your account, preferences, and organization context.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {toast && (
        <div className="settings-toast">
          {toast}
        </div>
      )}

      <div className="settings-grid">
        {/* A. Account / Profile */}
        <div className="settings-section">
          <div className="section-title"><User size={18}/> Account Profile</div>
          <div className="section-content">
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="text" value={user?.email || ''} readOnly className="readonly-input" />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input type="text" value={user?.role || ''} readOnly className="readonly-input" />
            </div>
          </div>
        </div>

        {/* B. Organization Context */}
        <div className="settings-section">
          <div className="section-title"><Building size={18}/> Organization Context</div>
          <div className="section-content">
            <div className="form-group">
              <label>Organization Name</label>
              <input type="text" value={org?.name || 'N/A'} readOnly className="readonly-input" />
            </div>
            <div className="form-group">
              <label>Organization ID</label>
              <input type="text" value={org?.id || 'N/A'} readOnly className="readonly-input" />
            </div>
            <div className="form-group">
              <label>Status</label>
              <input type="text" value={org?.status || 'N/A'} readOnly className="readonly-input" />
            </div>
          </div>
        </div>

        {/* C. UI Preferences */}
        <div className="settings-section">
          <div className="section-title"><Layout size={18}/> UI Preferences</div>
          <div className="section-content">
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Theme</label>
              <select 
                value={settings.theme || 'system'} 
                onChange={handleThemeChange}
                className="form-control"
              >
                <option value="system">System Default</option>
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
              </select>
            </div>
            <label className="toggle-label">
              <input 
                type="checkbox" 
                checked={settings.denseLayout} 
                onChange={handleDenseLayoutChange} 
              />
              <span>Use Dense Layout Mode</span>
            </label>
            <p className="setting-hint">Reduces padding and margins across the dashboard.</p>
          </div>
        </div>

        {/* D. Notification Preferences */}
        <div className="settings-section">
          <div className="section-title"><Bell size={18}/> Notification Preferences</div>
          <div className="section-content">
            <label className="toggle-label">
              <input type="checkbox" checked={settings.notifications.CRITICAL_THREAT} onChange={() => handleNotifToggle('CRITICAL_THREAT')} />
              <span>Critical Threats</span>
            </label>
            <label className="toggle-label">
              <input type="checkbox" checked={settings.notifications.INCIDENT_CREATED} onChange={() => handleNotifToggle('INCIDENT_CREATED')} />
              <span>Incident Created</span>
            </label>
            <label className="toggle-label">
              <input type="checkbox" checked={settings.notifications.INCIDENT_ASSIGNED} onChange={() => handleNotifToggle('INCIDENT_ASSIGNED')} />
              <span>Incident Assigned (to me)</span>
            </label>
            <label className="toggle-label">
              <input type="checkbox" checked={settings.notifications.SYSTEM} onChange={() => handleNotifToggle('SYSTEM')} />
              <span>System Alerts</span>
            </label>
          </div>
        </div>

        {/* E. Security */}
        <div className="settings-section">
          <div className="section-title"><Shield size={18}/> Security & Session</div>
          <div className="section-content">
            <div>
              <h4>Password Management</h4>
              
              <div className="form-group" style={{ marginTop: '10px' }}>
                <label>Current Password</label>
                <input type="password" value={pwd.current} onChange={e => setPwd({...pwd, current: e.target.value})} className="form-control" />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" value={pwd.new} onChange={e => setPwd({...pwd, new: e.target.value})} className="form-control" />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" value={pwd.confirm} onChange={e => setPwd({...pwd, confirm: e.target.value})} className="form-control" />
              </div>
              
              <button className="btn btn-secondary" onClick={handleChangePassword}>Change Password</button>
              
              {pwdStatus.message && (
                <div style={{ marginTop: '10px', color: pwdStatus.error ? 'var(--status-critical)' : 'var(--status-success)', fontSize: '0.9rem' }}>
                  {pwdStatus.message}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;