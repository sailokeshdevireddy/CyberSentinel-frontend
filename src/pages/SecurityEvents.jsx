import React, { useState, useEffect } from 'react';
import { getEvents } from '../services/eventService';
import { getRiskAssessment } from '../services/riskService';
import { Search, X, Activity, ShieldAlert, User, Clock, AlertCircle } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';

const SeverityBadge = ({ severity }) => {
  const sevKey = (severity || 'neutral').toLowerCase();
  return <span className={`badge badge-${sevKey}`}>{severity || 'UNKNOWN'}</span>;
};

const SecurityEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ searchTerm: '', severity: 'ALL', status: 'ALL' });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await getEvents(filters);
        if (res.success) setEvents(res.data);
        else setError('Failed to load events');
      } catch (err) {
        setError('An error occurred while loading events');
        console.error(err);
      }
      setLoading(false);
    };

    fetchEvents();
  }, [filters]);

  const handleSelectEvent = async (event) => {
    setSelectedEvent(event);
    try {
      const res = await getRiskAssessment('EVENT', event.id);
      if (res.success) setRiskAssessment(res.data);
      else setRiskAssessment(null);
    } catch (err) {
      setRiskAssessment(null);
      console.error(err);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">Security Events</h1>
          <p className="page-subtitle">Real-time telemetry ingestion, raw event logs, and automated risk scoring</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-success)' }}></span>
          <span>{events.length} events matching filter</span>
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
              placeholder="Search by event type, user identifier, IP address, or app ID..." 
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
            <option value="RECEIVED">Received</option>
            <option value="ANALYZED">Analyzed</option>
          </select>
        </div>
        
        {loading ? (
          <Spinner message="Ingesting security event feed..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => setFilters({ ...filters })} />
        ) : events.length === 0 ? (
          <EmptyState 
            title="No events found" 
            message="No security events match the current search filters and criteria." 
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event Type</th>
                  <th>Severity</th>
                  <th>User Identifier</th>
                  <th>Network / Host</th>
                  <th>Occurred At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr 
                    key={event.id} 
                    onClick={() => handleSelectEvent(event)} 
                    className="hover-row"
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={14} style={{ color: 'var(--brand-color)', flexShrink: 0 }} />
                        <strong style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.825rem' }}>
                          {event.eventType}
                        </strong>
                      </div>
                    </td>
                    <td><SeverityBadge severity={event.severity} /></td>
                    <td style={{ fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={13} style={{ color: 'var(--text-muted)' }} />
                        <span>{event.userIdentifier}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                          {event.ipAddress}
                        </span>
                        <span className="text-muted" style={{ fontSize: '0.725rem' }}>{event.device}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {new Date(event.occurredAt).toLocaleString()}
                    </td>
                    <td><StatusBadge status={event.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modern Event Details Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div 
            className="modal-dialog" 
            style={{ width: '100%', maxWidth: '680px' }}
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
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Event Analysis</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono, monospace)' }}>
                    ID: {selectedEvent.id}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)} 
                className="icon-btn"
                style={{ width: '30px', height: '30px' }}
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>
            
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Event Attributes Grid */}
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
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Type</span>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '2px', fontFamily: 'var(--font-mono, monospace)' }}>{selectedEvent.eventType}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>User Identity</span>
                  <div style={{ fontSize: '0.9rem', marginTop: '2px' }}>{selectedEvent.userIdentifier}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Application ID</span>
                  <div style={{ fontSize: '0.85rem', marginTop: '2px', fontFamily: 'var(--font-mono, monospace)' }}>{selectedEvent.applicationId}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Status</span>
                  <div style={{ marginTop: '2px' }}><StatusBadge status={selectedEvent.status} /></div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>IP & Location</span>
                  <div style={{ fontSize: '0.85rem', marginTop: '2px' }}>{selectedEvent.ipAddress} {selectedEvent.location ? `(${selectedEvent.location})` : ''}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Host Device</span>
                  <div style={{ fontSize: '0.85rem', marginTop: '2px' }}>{selectedEvent.device || 'Unspecified'}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Occurred At</span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{new Date(selectedEvent.occurredAt).toLocaleString()}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Received At</span>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{new Date(selectedEvent.receivedAt).toLocaleString()}</div>
                </div>
              </div>

              {/* Risk Assessment Block */}
              <div style={{ 
                background: 'var(--bg-primary)', 
                padding: '16px', 
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={15} style={{ color: 'var(--brand-color)' }} />
                    Explainable Risk Analysis
                  </h4>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <SeverityBadge severity={selectedEvent.severity} />
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 700, 
                      padding: '2px 8px', 
                      borderRadius: 'var(--radius-sm)', 
                      backgroundColor: 'var(--hover-color)',
                      fontFamily: 'var(--font-mono, monospace)' 
                    }}>
                      Score: {selectedEvent.riskScore !== null && selectedEvent.riskScore !== undefined ? selectedEvent.riskScore : 'N/A'}
                    </span>
                  </div>
                </div>
                
                {riskAssessment && riskAssessment.factors && (
                  <div style={{ marginTop: '14px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Triggered Risk Factors:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                      {riskAssessment.factors.map((f, i) => (
                        <div 
                          key={i} 
                          style={{ 
                            padding: '10px 12px', 
                            borderRadius: 'var(--radius-sm)', 
                            backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                        >
                          <div>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{f.label}</strong>
                            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{f.description}</p>
                          </div>
                          <span style={{ 
                            padding: '2px 8px', 
                            borderRadius: 'var(--radius-full)', 
                            backgroundColor: 'var(--status-critical-bg)', 
                            color: 'var(--status-critical)', 
                            fontWeight: 700, 
                            fontSize: '0.75rem',
                            flexShrink: 0
                          }}>
                            +{f.points} pts
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Raw Telemetry Metadata */}
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Raw Payload Metadata:
                </span>
                <pre style={{ 
                  background: 'var(--bg-primary)', 
                  padding: '14px', 
                  borderRadius: 'var(--radius-md)', 
                  overflowX: 'auto', 
                  marginTop: '6px',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.775rem',
                  lineHeight: 1.4,
                  color: 'var(--text-secondary)'
                }}>
                  {JSON.stringify(selectedEvent.metadata || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityEvents;