import React, { useState, useEffect } from 'react';
import { getIncidents, getIncidentById, updateIncidentStatus, getIncidentTimeline } from '../services/incidentService';
import { getRiskAssessment } from '../services/riskService';
import { Search, X, Activity, ShieldAlert, Clock, User, Layers, FileText, CheckCircle2 } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import StatusBadge from '../components/ui/StatusBadge';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';

const SeverityBadge = ({ severity }) => {
  const sevKey = (severity || 'neutral').toLowerCase();
  return <span className={`badge badge-${sevKey}`}>{severity || 'UNKNOWN'}</span>;
};

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ searchTerm: '', severity: 'ALL', status: 'ALL' });
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [timeline, setTimeline] = useState([]);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await getIncidents(filters);
      if (res.success) setIncidents(res.data);
      else setError('Failed to load incidents');
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncidents();
  }, [filters]);

  const handleSelectIncident = async (incident) => {
    try {
      const res = await getIncidentById(incident.id);
      if (res.success) {
        setSelectedIncident(res.data);
        
        // Fetch risk analysis
        const riskRes = await getRiskAssessment('INCIDENT', incident.id);
        if (riskRes.success) setRiskAssessment(riskRes.data);
        else setRiskAssessment(null);
        
        // Fetch timeline
        const timeRes = await getIncidentTimeline(incident.id);
        if (timeRes.success) setTimeline(timeRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedIncident) return;
    
    let resolution = null;
    if (['RESOLVED', 'CLOSED', 'FALSE_POSITIVE'].includes(newStatus)) {
      resolution = window.prompt("Please provide a resolution note for this incident:");
      if (!resolution) return; // cancel status change if user cancels prompt
    }
    
    try {
      const res = await updateIncidentStatus(selectedIncident.id, { status: newStatus, resolution });
      if (res.success) {
        setSelectedIncident(prev => ({...prev, status: newStatus, resolution}));
        fetchIncidents(); // refresh list
        
        // refresh timeline
        const timeRes = await getIncidentTimeline(selectedIncident.id);
        if (timeRes.success) setTimeline(timeRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">Incident Management</h1>
          <p className="page-subtitle">Triage, investigate, collaborate, and execute resolution playbooks</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--status-critical)' }}></span>
          <span>{incidents.length} active incidents</span>
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
              placeholder="Search by incident title..." 
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
            <option value="INVESTIGATING">Investigating</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="FALSE_POSITIVE">False Positive</option>
          </select>
        </div>
        
        {loading ? (
          <Spinner message="Loading incident database..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => setFilters({ ...filters })} />
        ) : incidents.length === 0 ? (
          <EmptyState 
            title="No incidents found" 
            message="No security incidents match the current query." 
          />
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Severity</th>
                  <th>Risk Score</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Assigned Responder</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map(incident => (
                  <tr 
                    key={incident.id} 
                    onClick={() => handleSelectIncident(incident)} 
                    className="hover-row"
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ShieldAlert size={15} style={{ color: incident.severity === 'CRITICAL' ? 'var(--status-critical)' : 'var(--brand-color)', flexShrink: 0 }} />
                        <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                          {incident.title}
                        </strong>
                      </div>
                    </td>
                    <td><SeverityBadge severity={incident.severity} /></td>
                    <td>
                      <span style={{ 
                        fontFamily: 'var(--font-mono, monospace)', 
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        color: incident.riskScore >= 70 ? 'var(--status-critical)' : 'var(--text-primary)' 
                      }}>
                        {incident.riskScore === null || incident.riskScore === undefined ? 'N/A' : incident.riskScore}
                      </span>
                    </td>
                    <td><StatusBadge status={incident.status} /></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                      {new Date(incident.createdAt).toLocaleString()}
                    </td>
                    <td style={{ fontSize: '0.825rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={13} style={{ color: 'var(--text-muted)' }} />
                        <span>{incident.assignedToUserId || 'Unassigned'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modern Incident Investigation Studio Modal */}
      {selectedIncident && (
        <div className="modal-overlay" onClick={() => setSelectedIncident(null)}>
          <div 
            className="modal-dialog" 
            style={{ width: '96%', maxWidth: '1100px', height: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ 
              padding: '18px 24px', 
              borderBottom: '1px solid var(--border-color)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              backgroundColor: 'var(--bg-primary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'var(--status-critical-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-critical)' }}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{selectedIncident.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono, monospace)' }}>
                    INCIDENT ID: {selectedIncident.id}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedIncident(null)} 
                className="icon-btn"
                style={{ width: '32px', height: '32px' }}
                aria-label="Close incident modal"
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Body: Split View */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexWrap: 'wrap' }}>
              
              {/* Left Column: Details, Risk & Entities */}
              <div style={{ flex: '1 1 560px', padding: '24px', overflowY: 'auto', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Status Bar */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '14px 18px', 
                  backgroundColor: 'var(--bg-primary)', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-color)',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Lifecycle Status:
                    </span>
                    <select 
                      value={selectedIncident.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="form-control"
                      style={{ fontWeight: 600, padding: '6px 12px' }}
                    >
                      <option value="OPEN">Open</option>
                      <option value="INVESTIGATING">Investigating</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                      <option value="FALSE_POSITIVE">False Positive</option>
                    </select>
                  </div>
                  
                  <div style={{ fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Assigned: </span>
                    <strong>{selectedIncident.assignedToUserId || 'Unassigned'}</strong>
                  </div>
                </div>

                {/* Attributes Grid */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                  gap: '14px',
                  padding: '16px',
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Application Scope</span>
                    <div style={{ fontSize: '0.85rem', marginTop: '2px', fontFamily: 'var(--font-mono, monospace)' }}>{selectedIncident.applicationId}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Severity Assessment</span>
                    <div style={{ marginTop: '2px' }}><SeverityBadge severity={selectedIncident.severity} /></div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Created Timestamp</span>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{new Date(selectedIncident.createdAt).toLocaleString()}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Last Modified</span>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{new Date(selectedIncident.updatedAt).toLocaleString()}</div>
                  </div>
                </div>

                {/* Risk Factors */}
                <div style={{ 
                  background: 'var(--bg-primary)', 
                  padding: '16px', 
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Automated Risk Factors</h4>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 700, 
                      padding: '2px 8px', 
                      borderRadius: 'var(--radius-sm)', 
                      backgroundColor: 'var(--hover-color)',
                      fontFamily: 'var(--font-mono, monospace)' 
                    }}>
                      Composite Risk: {selectedIncident.riskScore === null || selectedIncident.riskScore === undefined ? 'Not Evaluated' : selectedIncident.riskScore}
                    </span>
                  </div>
                  
                  {riskAssessment && riskAssessment.factors && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {riskAssessment.factors.map((f, i) => (
                        <div key={i} style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '0.85rem' }}>{f.label}</strong>
                            <span style={{ padding: '2px 6px', borderRadius: 'var(--radius-full)', background: 'var(--status-critical-bg)', color: 'var(--status-critical)', fontSize: '0.7rem', fontWeight: 700 }}>
                              +{f.points} pts
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                            <code style={{ fontSize: '0.75rem', color: 'var(--brand-color)' }}>{f.code}</code>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>• {f.description}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {(!riskAssessment || !riskAssessment.factors || riskAssessment.factors.length === 0) && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0' }}>No risk breakdown factors available.</p>
                  )}
                </div>

                {/* Related Entities */}
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={15} style={{ color: 'var(--brand-color)' }} />
                    Correlated Entities
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Threats ({selectedIncident.relatedThreatIds?.length || 0})
                      </strong>
                      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {selectedIncident.resolvedThreats?.map(t => (
                          <div key={t.id} style={{ padding: '6px 8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{t.type}</span>
                            <SeverityBadge severity={t.severity} />
                          </div>
                        ))}
                        {(!selectedIncident.resolvedThreats || selectedIncident.resolvedThreats.length === 0) && (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No threat details linked</span>
                        )}
                      </div>
                    </div>

                    <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <strong style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Security Events ({selectedIncident.relatedEventIds?.length || 0})
                      </strong>
                      <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {selectedIncident.resolvedEvents?.map(e => (
                          <div key={e.id} style={{ padding: '6px 8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem' }}>
                            <div style={{ fontWeight: 600 }}>{e.eventType}</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{e.userIdentifier}</div>
                          </div>
                        ))}
                        {(!selectedIncident.resolvedEvents || selectedIncident.resolvedEvents.length === 0) && (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No event details linked</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resolution Note */}
                <div style={{ background: 'var(--bg-primary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ margin: '0 0 6px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--status-success)' }} />
                    Resolution Summary
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: selectedIncident.resolution ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {selectedIncident.resolution || 'No formal resolution recorded yet.'}
                  </div>
                </div>

              </div>

              {/* Right Column: Timeline & Notes */}
              <div style={{ flex: '1 1 360px', padding: '24px', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', gap: '20px' }}>
                <div>
                  <h4 style={{ margin: '0 0 16px', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={16} style={{ color: 'var(--brand-color)' }} /> 
                    Investigation Timeline
                  </h4>
                  <div style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '6px' }}>
                    {timeline.map(t => (
                      <div key={t.id} style={{ marginBottom: '16px', position: 'relative', paddingLeft: '20px', borderLeft: '2px solid var(--brand-color)' }}>
                        <div style={{ position: 'absolute', left: '-5px', top: '2px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--brand-color)' }}></div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(t.occurredAt).toLocaleString()}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '2px' }}>{t.type}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{t.description}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          By: <span style={{ color: 'var(--text-primary)' }}>{t.actorName}</span> ({t.actorType})
                        </div>
                      </div>
                    ))}
                    {timeline.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No timeline records found.
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} style={{ color: 'var(--brand-color)' }} />
                    Case Notes
                  </h4>
                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedIncident.notes?.map(note => (
                      <div key={note.id} style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.775rem' }}>
                          <strong style={{ color: 'var(--brand-color)' }}>{note.authorName}</strong>
                          <span className="text-muted">{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{note.note}</div>
                      </div>
                    ))}
                    {(!selectedIncident.notes || selectedIncident.notes.length === 0) && (
                      <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.85rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                        No case notes attached.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Incidents;