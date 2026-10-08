import React, { useState, useEffect } from 'react';
import { getIncidents, getIncidentById, updateIncidentStatus, getIncidentTimeline } from '../services/incidentService';
import { getRiskAssessment } from '../services/riskService';
import { Search, Loader, X, Activity } from 'lucide-react';

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ searchTerm: '', severity: 'ALL', status: 'ALL' });
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
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
    <div className="page-wrapper" style={{ padding: '20px' }}>
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h1 className="page-title">Incident Management</h1>
        <p className="page-subtitle text-muted">Track, investigate, and resolve security incidents.</p>
      </div>

      <div className="card" style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div className="table-toolbar" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', flex: 1 }}>
            <Search size={18} className="text-muted" style={{ marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder="Search by title..." 
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
            <option value="INVESTIGATING">Investigating</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="FALSE_POSITIVE">False Positive</option>
          </select>
        </div>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader className="spin" /></div>
        ) : error ? (
          <div style={{ color: 'var(--status-critical)', padding: '20px', textAlign: 'center' }}>{error}</div>
        ) : incidents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No incidents found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px' }}>Title</th>
                  <th style={{ padding: '12px' }}>Severity</th>
                  <th style={{ padding: '12px' }}>Risk Score</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Created At</th>
                  <th style={{ padding: '12px' }}>Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map(incident => (
                  <tr key={incident.id} onClick={() => handleSelectIncident(incident)} style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.2s' }} className="hover-row">
                    <td style={{ padding: '12px' }}><strong>{incident.title}</strong></td>
                    <td style={{ padding: '12px' }}><span style={{ color: 'var(--status-' + incident.severity?.toLowerCase() + ')' }}>{incident.severity}</span></td>
                    <td style={{ padding: '12px' }}>{incident.riskScore === null ? 'N/A' : incident.riskScore}</td>
                    <td style={{ padding: '12px' }}>{incident.status}</td>
                    <td style={{ padding: '12px' }}>{new Date(incident.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>{incident.assignedToUserId || 'Unassigned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedIncident && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', width: '95%', maxWidth: '1000px', height: '90vh', display: 'flex', flexDirection: 'column', border: '1px solid var(--border-color)' }}>
            
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>{selectedIncident.title}</h2>
              <button onClick={() => setSelectedIncident(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><X size={24} /></button>
            </div>
            
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              {/* Left Column: Details & Risk */}
              <div style={{ flex: 2, padding: '20px', overflowY: 'auto', borderRight: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div>
                    <strong className="text-muted">Status:</strong>
                    <select 
                      value={selectedIncident.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      style={{ marginLeft: '10px', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                    >
                      <option value="OPEN">Open</option>
                      <option value="INVESTIGATING">Investigating</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                      <option value="FALSE_POSITIVE">False Positive</option>
                    </select>
                  </div>
                  <div><strong className="text-muted">Assigned To:</strong> {selectedIncident.assignedToUserId || 'Unassigned'}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  <div><strong className="text-muted">ID:</strong> <div style={{ fontSize: '0.9rem' }}>{selectedIncident.id}</div></div>
                  <div><strong className="text-muted">App ID:</strong> <div style={{ fontSize: '0.9rem' }}>{selectedIncident.applicationId}</div></div>
                  <div><strong className="text-muted">Created:</strong> <div>{new Date(selectedIncident.createdAt).toLocaleString()}</div></div>
                  <div><strong className="text-muted">Updated:</strong> <div>{new Date(selectedIncident.updatedAt).toLocaleString()}</div></div>
                </div>

                <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                  <h3>Risk Analysis</h3>
                  <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                    <div><strong className="text-muted">Severity:</strong> <div><span style={{ color: 'var(--status-' + selectedIncident.severity?.toLowerCase() + ')' }}>{selectedIncident.severity}</span></div></div>
                    <div><strong className="text-muted">Risk Score:</strong> <div>{selectedIncident.riskScore === null ? 'Not Evaluated' : selectedIncident.riskScore}</div></div>
                  </div>
                  
                  {riskAssessment && (
                    <div style={{ marginTop: '16px' }}>
                      <strong className="text-muted">Factors:</strong>
                      <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                        {riskAssessment.factors.map((f, i) => (
                          <li key={i} style={{ marginBottom: '8px' }}>
                            <strong>{f.label} ({f.points} pts)</strong> [<code>{f.code}</code>]<br />
                            <span className="text-muted">{f.description}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="text-muted" style={{ marginTop: '10px', fontSize: '0.85rem' }}>Evaluated At: {new Date(riskAssessment.evaluatedAt).toLocaleString()}</div>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h3>Related Entities</h3>
                  <div style={{ marginTop: '10px' }}>
                    <strong className="text-muted">Threats ({selectedIncident.relatedThreatIds?.length || 0})</strong>
                    {selectedIncident.resolvedThreats?.map(t => (
                      <div key={t.id} style={{ padding: '8px', background: 'var(--bg-primary)', borderRadius: '4px', margin: '4px 0', fontSize: '0.9rem' }}>
                        {t.type} - {t.severity}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <strong className="text-muted">Events ({selectedIncident.relatedEventIds?.length || 0})</strong>
                    {selectedIncident.resolvedEvents?.map(e => (
                      <div key={e.id} style={{ padding: '8px', background: 'var(--bg-primary)', borderRadius: '4px', margin: '4px 0', fontSize: '0.9rem' }}>
                        {e.eventType} - {e.userIdentifier}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h3>Resolution</h3>
                  <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '4px', marginTop: '8px' }}>
                    {selectedIncident.resolution ? selectedIncident.resolution : <span className="text-muted">No resolution recorded.</span>}
                  </div>
                </div>

              </div>

              {/* Right Column: Timeline & Notes */}
              <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', background: 'var(--bg-canvas)' }}>
                <h3 style={{ marginBottom: '16px' }}><Activity size={18} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Timeline</h3>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {timeline.map(t => (
                    <div key={t.id} style={{ marginBottom: '16px', position: 'relative', paddingLeft: '20px', borderLeft: '2px solid var(--brand-color)' }}>
                      <div style={{ position: 'absolute', left: '-6px', top: 0, width: '10px', height: '10px', borderRadius: '50%', background: 'var(--brand-color)' }}></div>
                      <div style={{ fontSize: '0.85rem' }} className="text-muted">{new Date(t.occurredAt).toLocaleString()}</div>
                      <div style={{ fontWeight: '500' }}>{t.type}</div>
                      <div style={{ fontSize: '0.9rem' }}>{t.description}</div>
                      <div style={{ fontSize: '0.8rem' }} className="text-muted">By: {t.actorName} ({t.actorType})</div>
                    </div>
                  ))}
                  {timeline.length === 0 && <div className="text-muted">No timeline events.</div>}
                </div>

                <h3 style={{ marginTop: '20px', marginBottom: '16px' }}>Notes</h3>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {selectedIncident.notes?.map(note => (
                    <div key={note.id} style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '6px', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                        <strong>{note.authorName}</strong>
                        <span className="text-muted">{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <div style={{ fontSize: '0.9rem' }}>{note.note}</div>
                    </div>
                  ))}
                  {(!selectedIncident.notes || selectedIncident.notes.length === 0) && <div className="text-muted">No notes available.</div>}
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