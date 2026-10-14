import React, { useState, useEffect } from 'react';
import { getApplications, createApplication } from '../services/applicationService';
import { Search, Plus, X, AppWindow, Key, ShieldCheck, Clock, Copy, Check } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import Button from '../components/ui/Button';

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ searchTerm: '', status: 'ALL' });
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Registration Modal State
  const [showRegModal, setShowRegModal] = useState(false);
  const [newAppForm, setNewAppForm] = useState({ name: '', description: '' });
  const [newAppResult, setNewAppResult] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState('');

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await getApplications(filters);
      if (res.success) setApps(res.data);
      else setError('Failed to load applications');
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApps();
  }, [filters]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await createApplication(newAppForm);
      if (res.success) {
        setNewAppResult(res.data);
        fetchApps();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeRegModal = () => {
    setShowRegModal(false);
    setNewAppResult(null);
    setNewAppForm({ name: '', description: '' });
    setCopyFeedback('');
  };

  const handleCopyText = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(type);
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">Protected Applications</h1>
          <p className="page-subtitle">Configure security agents, telemetry credentials, and tenant boundaries</p>
        </div>
        <Button onClick={() => setShowRegModal(true)}>
          <Plus size={16} style={{ marginRight: '6px' }} /> Register Application
        </Button>
      </div>

      <div className="card">
        {/* Table Toolbar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            background: 'var(--bg-primary)', 
            padding: '8px 14px', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-color)', 
            flex: 1,
            minWidth: '240px'
          }}>
            <Search size={16} className="text-muted" style={{ marginRight: '10px', flexShrink: 0 }} />
            <input 
              type="text" 
              placeholder="Search applications by name or description..." 
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'var(--text-primary)', 
                outline: 'none', 
                width: '100%',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="form-control"
            style={{ width: '160px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        
        {loading ? (
          <Spinner message="Querying application inventory..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => setFilters({ ...filters })} />
        ) : apps.length === 0 ? (
          <EmptyState 
            title="No applications registered" 
            message="No protected endpoints found. Click 'Register Application' above to onboard your first application." 
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Application Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Last Event Telemetry</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(app => (
                  <tr 
                    key={app.id} 
                    onClick={() => setSelectedApp(app)} 
                    className="hover-row"
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: 'var(--radius-sm)', background: 'var(--brand-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-color)' }}>
                          <AppWindow size={16} />
                        </div>
                        <strong style={{ fontSize: '0.875rem' }}>{app.name}</strong>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{app.description}</td>
                    <td><StatusBadge status={app.status} /></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {new Date(app.createdAt).toLocaleString()}
                    </td>
                    <td style={{ fontSize: '0.825rem' }}>
                      {app.lastEventAt ? (
                        <span style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={14} style={{ color: 'var(--status-success)' }} />
                          {new Date(app.lastEventAt).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-muted">No telemetry received</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div 
            className="modal-dialog" 
            style={{ width: '100%', maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              padding: '18px 24px', 
              borderBottom: '1px solid var(--border-color)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: 'var(--bg-primary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'var(--brand-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand-color)' }}>
                  <AppWindow size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>{selectedApp.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Application Context</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedApp(null)} 
                className="icon-btn"
                style={{ width: '30px', height: '30px' }}
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '14px',
                padding: '16px',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Application ID</span>
                  <div style={{ fontSize: '0.85rem', marginTop: '2px', fontFamily: 'var(--font-mono, monospace)' }}>{selectedApp.id}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Status</span>
                  <div style={{ marginTop: '2px' }}><StatusBadge status={selectedApp.status} /></div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Onboarding Date</span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{new Date(selectedApp.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Last Ingestion</span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {selectedApp.lastEventAt ? new Date(selectedApp.lastEventAt).toLocaleString() : 'No events yet'}
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Description</span>
                  <div style={{ fontSize: '0.85rem', marginTop: '2px', color: 'var(--text-secondary)' }}>{selectedApp.description}</div>
                </div>
              </div>

              {/* API Credentials */}
              <div style={{ 
                background: 'var(--bg-primary)', 
                padding: '18px', 
                borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--border-color)' 
              }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Key size={15} style={{ color: 'var(--brand-color)' }} />
                  Integration Telemetry Credentials
                </h4>
                <p className="text-muted" style={{ fontSize: '0.775rem', marginBottom: '14px' }}>
                  Attach these keys to your security SDK or HTTP collector agent to ingest events.
                </p>
                
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    API KEY (PUBLIC)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <code style={{ 
                      flex: 1, 
                      padding: '8px 12px', 
                      background: 'var(--bg-secondary)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: 'var(--text-primary)'
                    }}>
                      {selectedApp.apiKey || 'Not generated'}
                    </code>
                    {selectedApp.apiKey && (
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleCopyText(selectedApp.apiKey, 'key')}
                        title="Copy API Key"
                      >
                        {copyFeedback === 'key' ? <Check size={14} color="var(--status-success)" /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    API SECRET
                  </span>
                  <code style={{ 
                    display: 'block', 
                    padding: '8px 12px', 
                    background: 'var(--bg-secondary)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-mono, monospace)'
                  }}>
                    {selectedApp.secretMasked || '••••••••••••••••••••••••'}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegModal && (
        <div className="modal-overlay" onClick={closeRegModal}>
          <div 
            className="modal-dialog" 
            style={{ width: '100%', maxWidth: '520px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              padding: '18px 24px', 
              borderBottom: '1px solid var(--border-color)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: 'var(--bg-primary)'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Register New Protected Application</h3>
              <button 
                onClick={closeRegModal} 
                className="icon-btn"
                style={{ width: '30px', height: '30px' }}
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>
            
            <div style={{ padding: '24px' }}>
              {newAppResult ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ 
                    padding: '14px 16px', 
                    background: 'var(--status-success-bg)', 
                    border: '1px solid var(--status-success-border)',
                    color: 'var(--status-success)', 
                    borderRadius: 'var(--radius-md)', 
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <ShieldCheck size={18} />
                    Application successfully onboarded!
                  </div>

                  <div style={{ 
                    background: 'var(--bg-primary)', 
                    padding: '16px', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border-color)' 
                  }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--status-high)', fontWeight: 600, marginBottom: '12px' }}>
                      Important: Store your secret immediately. It will NOT be revealed again.
                    </p>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                        API KEY:
                      </span>
                      <code style={{ display: 'block', padding: '8px 10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                        {newAppResult.application.apiKey}
                      </code>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                        API SECRET:
                      </span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <code style={{ flex: 1, padding: '8px 10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', color: 'var(--status-high)', fontSize: '0.8rem', fontWeight: 700 }}>
                          {newAppResult.apiSecret}
                        </code>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleCopyText(newAppResult.apiSecret, 'newSecret')}
                        >
                          {copyFeedback === 'newSecret' ? <Check size={14} color="var(--status-success)" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button onClick={closeRegModal} style={{ width: '100%', marginTop: '8px' }}>
                    Done & Close
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      Application Name
                    </label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Identity Service, Payments Gateway"
                      value={newAppForm.name} 
                      onChange={e => setNewAppForm({...newAppForm, name: e.target.value})}
                      className="form-control"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      Description
                    </label>
                    <textarea 
                      required 
                      placeholder="Specify the purpose, environment, or scope of this protected workload..."
                      value={newAppForm.description} 
                      onChange={e => setNewAppForm({...newAppForm, description: e.target.value})}
                      rows={3}
                      className="form-control"
                      style={{ width: '100%', resize: 'vertical' }}
                    />
                  </div>
                  <Button type="submit" style={{ marginTop: '8px', padding: '10px' }}>
                    Register & Generate Credentials
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;