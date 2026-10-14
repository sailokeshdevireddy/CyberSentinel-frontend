import React, { useState, useEffect } from 'react';
import { getThreats, getThreatById } from '../services/threatService';
import { Search, X, AlertTriangle, Clock, Layers } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';

const SeverityBadge = ({ severity }) => {
  const sevKey = (severity || 'neutral').toLowerCase();
  return <span className={`badge badge-${sevKey}`}>{severity || 'UNKNOWN'}</span>;
};

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
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">Threat Intelligence</h1>
          <p className="page-subtitle">Aggregated threat vectors, correlation patterns, and automated detection campaigns</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--brand-color)' }}></span>
          <span>{threats.length} correlated threats</span>
        </div>
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
              placeholder="Search by threat type or signature..." 
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
            value={filters.severity} 
            onChange={(e) => setFilters({...filters, severity: e.target.value})}
            className="form-control"
            style={{ width: '160px' }}
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
            className="form-control"
            style={{ width: '160px' }}
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="ESCALATED">Escalated</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>
        
        {loading ? (
          <Spinner message="Analyzing threat intelligence..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => setFilters({ ...filters })} />
        ) : threats.length === 0 ? (
          <EmptyState 
            title="No threats detected" 
            message="No active threat vectors matching the specified filters were found in your environment." 
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Threat Type</th>
                  <th>Severity</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Related Telemetries</th>
                </tr>
              </thead>
              <tbody>
                {threats.map(threat => (
                  <tr 
                    key={threat.id} 
                    onClick={() => handleSelectThreat(threat)} 
                    className="hover-row"
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertTriangle size={15} style={{ color: 'var(--status-high)', flexShrink: 0 }} />
                        <strong style={{ fontSize: '0.85rem' }}>{threat.type}</strong>
                      </div>
                    </td>
                    <td><SeverityBadge severity={threat.severity} /></td>
                    <td>
                      <span style={{ 
                        fontFamily: 'var(--font-mono, monospace)', 
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: threat.riskScore >= 70 ? 'var(--status-critical)' : 'var(--text-primary)' 
                      }}>
                        {threat.riskScore === null || threat.riskScore === undefined ? 'N/A' : threat.riskScore}
                      </span>
                    </td>
                    <td><StatusBadge status={threat.status} /></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {new Date(threat.createdAt).toLocaleString()}
                    </td>
                    <td>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: 'var(--radius-full)', 
                        background: 'var(--bg-primary)', 
                        border: '1px solid var(--border-color)',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)'
                      }}>
                        {threat.relatedEventIds?.length || 0} events
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedThreat && (
        <div className="modal-overlay" onClick={() => setSelectedThreat(null)}>
          <div 
            className="modal-dialog" 
            style={{ width: '100%', maxWidth: '720px' }}
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
                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'var(--status-high-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-high)' }}>
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Threat Analysis</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono, monospace)' }}>
                    ID: {selectedThreat.id}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedThreat(null)} 
                className="icon-btn"
                style={{ width: '30px', height: '30px' }}
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>
            
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Threat Classification</span>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '2px' }}>{selectedThreat.type}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Application Scope</span>
                  <div style={{ fontSize: '0.85rem', marginTop: '2px', fontFamily: 'var(--font-mono, monospace)' }}>{selectedThreat.applicationId}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Severity & Risk</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <SeverityBadge severity={selectedThreat.severity} />
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 700, fontSize: '0.85rem' }}>
                      Score: {selectedThreat.riskScore === null || selectedThreat.riskScore === undefined ? 'N/A' : selectedThreat.riskScore}
                    </span>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Lifecycle Status</span>
                  <div style={{ marginTop: '2px' }}><StatusBadge status={selectedThreat.status} /></div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>First Detected</span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{new Date(selectedThreat.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Last Updated</span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{new Date(selectedThreat.updatedAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Related Events Section */}
              <div style={{ 
                background: 'var(--bg-primary)', 
                padding: '16px', 
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)' 
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={15} style={{ color: 'var(--brand-color)' }} />
                    Correlated Security Events ({selectedThreat.relatedEventIds?.length || 0})
                  </h4>
                </div>

                {selectedThreat.resolvedEvents && selectedThreat.resolvedEvents.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedThreat.resolvedEvents.map(evt => (
                      <div 
                        key={evt.id} 
                        style={{ 
                          padding: '10px 14px', 
                          borderRadius: 'var(--radius-sm)', 
                          backgroundColor: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, fontSize: '0.825rem' }}>
                            {evt.eventType}
                          </span>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>• {evt.userIdentifier}</span>
                        </div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {new Date(evt.occurredAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No correlated raw events loaded.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Threats;