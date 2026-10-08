import React, { useState, useEffect } from 'react';
import { getApplications, createApplication } from '../services/applicationService';
import { Search, Loader, X, Plus } from 'lucide-react';

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

  useEffect(() => {
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
  };

  return (
    <div className="page-wrapper" style={{ padding: '20px' }}>
      <div className="page-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Applications</h1>
          <p className="page-subtitle text-muted">Manage and monitor protected applications.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowRegModal(true)}>
          <Plus size={16} style={{ marginRight: '8px' }} /> Add Application
        </button>
      </div>

      <div className="card" style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div className="table-toolbar" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', flex: 1 }}>
            <Search size={18} className="text-muted" style={{ marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder="Search applications..." 
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%' }}
            />
          </div>
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader className="spin" /></div>
        ) : error ? (
          <div style={{ color: 'var(--status-critical)', padding: '20px', textAlign: 'center' }}>{error}</div>
        ) : apps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No applications found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px' }}>Name</th>
                  <th style={{ padding: '12px' }}>Description</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Created At</th>
                  <th style={{ padding: '12px' }}>Last Event At</th>
                </tr>
              </thead>
              <tbody>
                {apps.map(app => (
                  <tr key={app.id} onClick={() => setSelectedApp(app)} style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.2s' }} className="hover-row">
                    <td style={{ padding: '12px' }}><strong>{app.name}</strong></td>
                    <td style={{ padding: '12px' }}>{app.description}</td>
                    <td style={{ padding: '12px' }}><span style={{ color: app.status === 'ACTIVE' ? 'var(--status-success)' : 'var(--text-muted)' }}>{app.status}</span></td>
                    <td style={{ padding: '12px' }}>{new Date(app.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>{app.lastEventAt ? new Date(app.lastEventAt).toLocaleString() : <span className="text-muted">No events yet</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '600px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Application Details</h2>
              <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><X /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '24px' }}>
              <div><strong className="text-muted">ID:</strong> <div style={{ fontSize: '0.9rem' }}>{selectedApp.id}</div></div>
              <div><strong className="text-muted">Name:</strong> <div>{selectedApp.name}</div></div>
              <div><strong className="text-muted">Description:</strong> <div>{selectedApp.description}</div></div>
              <div><strong className="text-muted">Status:</strong> <div>{selectedApp.status}</div></div>
              <div><strong className="text-muted">Created At:</strong> <div>{new Date(selectedApp.createdAt).toLocaleString()}</div></div>
              <div><strong className="text-muted">Last Event:</strong> <div>{selectedApp.lastEventAt ? new Date(selectedApp.lastEventAt).toLocaleString() : 'No events yet'}</div></div>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '12px' }}>API Credentials</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '12px' }}>Use these to configure event ingestion.</p>
              <div style={{ marginBottom: '8px' }}>
                <strong className="text-muted" style={{ display: 'block', fontSize: '0.8rem' }}>API Key (Public):</strong>
                <code>{selectedApp.apiKey || 'Not generated'}</code>
              </div>
              <div>
                <strong className="text-muted" style={{ display: 'block', fontSize: '0.8rem' }}>API Secret:</strong>
                <code>{selectedApp.secretMasked || '••••••••'}</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {showRegModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '500px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Register New Application</h2>
              <button onClick={closeRegModal} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><X /></button>
            </div>
            
            {newAppResult ? (
              <div>
                <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-success)', borderRadius: '6px', marginBottom: '20px' }}>
                  Application registered successfully!
                </div>
                <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '12px' }}>Please copy this secret now. It will not be shown again.</p>
                  <div style={{ marginBottom: '8px' }}>
                    <strong style={{ display: 'block', fontSize: '0.8rem' }}>API Key:</strong>
                    <code>{newAppResult.application.apiKey}</code>
                  </div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.8rem' }}>API Secret:</strong>
                    <code style={{ color: 'var(--status-high)' }}>{newAppResult.apiSecret}</code>
                  </div>
                </div>
                <button className="btn btn-primary" onClick={closeRegModal} style={{ width: '100%' }}>Done</button>
              </div>
            ) : (
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Application Name</label>
                  <input 
                    type="text" 
                    required 
                    value={newAppForm.name} 
                    onChange={e => setNewAppForm({...newAppForm, name: e.target.value})}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Description</label>
                  <textarea 
                    required 
                    value={newAppForm.description} 
                    onChange={e => setNewAppForm({...newAppForm, description: e.target.value})}
                    rows={4}
                    style={{ width: '100%', padding: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', padding: '12px' }}>Register Application</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;