import React, { useState, useEffect } from 'react';
import { getThreats, getThreatById } from '../services/threatService';
import { Loader, X, Search } from 'lucide-react';

const Threats = () => {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ searchTerm: '', severity: 'ALL', status: 'ALL' });
  const [selectedThreat, setSelectedThreat] = useState(null);

  useEffect(() => {
    const fetchThreats = async () => {
      setLoading(true);
      try {
        const res = await getThreats(filters);
        if (res.success) setThreats(res.data);
        else setError('Failed to load threats');
      } catch (err) {
        setError('An error occurred while loading threats');
        console.error(err);
      }
      setLoading(false);
    };

    fetchThreats();
  }, [filters]);

  const handleSelectThreat = async (threat) => {
    try {
      const res = await getThreatById(threat.id);
      if (res.success) setSelectedThreat(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-wrapper" style={{ padding: '20px' }}>
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h1 className="page-title">Threat Intelligence</h1>
        <p className="page-subtitle text-muted">Identified threat actors and active threat campaigns.</p>
      </div>

      <div className="card" style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div className="table-toolbar" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', flex: 1 }}>
            <Search size={18} className="text-muted" style={{ marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder="Search by threat type..." 
              value={filters.searchTerm}
              onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%' }}
            />
          </div>
          <select 
            value={filters.severity} 
            onChange={(e) => setFilters({...filters, severity: e.target.value})}
            style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="ESCALATED">Escalated</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader className="spin" /></div>
        ) : error ? (
          <div style={{ color: 'var(--status-critical)', padding: '20px', textAlign: 'center' }}>{error}</div>
        ) : threats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No threats found matching criteria.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px' }}>Type</th>
                  <th style={{ padding: '12px' }}>Severity</th>
                  <th style={{ padding: '12px' }}>Risk Score</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Created At</th>
                  <th style={{ padding: '12px' }}>Events</th>
                </tr>
              </thead>
              <tbody>
                {threats.map(threat => (
                  <tr key={threat.id} onClick={() => handleSelectThreat(threat)} style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.2s' }} className="hover-row">
                    <td style={{ padding: '12px' }}><strong>{threat.type}</strong></td>
                    <td style={{ padding: '12px' }}><span style={{ color: 'var(--status-' + threat.severity?.toLowerCase() + ')' }}>{threat.severity}</span></td>
                    <td style={{ padding: '12px' }}>{threat.riskScore === null ? 'N/A' : threat.riskScore}</td>
                    <td style={{ padding: '12px' }}>{threat.status}</td>
                    <td style={{ padding: '12px' }}>{new Date(threat.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>{threat.relatedEventIds?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedThreat && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Threat Details</h2>
              <button onClick={() => setSelectedThreat(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><X /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div><strong className="text-muted">ID:</strong> <div>{selectedThreat.id}</div></div>
              <div><strong className="text-muted">Type:</strong> <div>{selectedThreat.type}</div></div>
              <div><strong className="text-muted">App ID:</strong> <div>{selectedThreat.applicationId}</div></div>
              <div><strong className="text-muted">Severity:</strong> <div><span style={{ color: 'var(--status-' + selectedThreat.severity?.toLowerCase() + ')' }}>{selectedThreat.severity}</span></div></div>
              <div><strong className="text-muted">Risk Score:</strong> <div>{selectedThreat.riskScore === null ? 'Not Evaluated' : selectedThreat.riskScore}</div></div>
              <div><strong className="text-muted">Status:</strong> <div>{selectedThreat.status}</div></div>
              <div><strong className="text-muted">Created At:</strong> <div>{new Date(selectedThreat.createdAt).toLocaleString()}</div></div>
              <div><strong className="text-muted">Updated At:</strong> <div>{new Date(selectedThreat.updatedAt).toLocaleString()}</div></div>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '12px' }}>Related Events ({selectedThreat.relatedEventIds?.length || 0})</h3>
              {selectedThreat.resolvedEvents && selectedThreat.resolvedEvents.length > 0 ? (
                <ul style={{ paddingLeft: '20px' }}>
                  {selectedThreat.resolvedEvents.map(evt => (
                    <li key={evt.id} style={{ marginBottom: '8px' }}>
                      <strong>{evt.eventType}</strong> - {evt.userIdentifier} - {new Date(evt.occurredAt).toLocaleString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-muted">No related events found or loaded.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Threats;