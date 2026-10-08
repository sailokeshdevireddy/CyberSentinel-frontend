import React, { useState, useEffect } from 'react';
import { getEvents } from '../services/eventService';
import { getRiskAssessment } from '../services/riskService';
import { Search, Loader, X } from 'lucide-react';

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
    <div className="page-wrapper" style={{ padding: '20px' }}>
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h1 className="page-title">Security Events</h1>
        <p className="page-subtitle text-muted">Monitor and analyze raw security events across your infrastructure.</p>
      </div>

      <div className="card" style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div className="table-toolbar" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', flex: 1 }}>
            <Search size={18} className="text-muted" style={{ marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder="Search by type, user, IP, or app ID..." 
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
            <option value="RECEIVED">Received</option>
            <option value="ANALYZED">Analyzed</option>
          </select>
        </div>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader className="spin" /></div>
        ) : error ? (
          <div style={{ color: 'var(--status-critical)', padding: '20px', textAlign: 'center' }}>{error}</div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No events found matching criteria.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px' }}>Event Type</th>
                  <th style={{ padding: '12px' }}>Severity</th>
                  <th style={{ padding: '12px' }}>User</th>
                  <th style={{ padding: '12px' }}>IP / Device</th>
                  <th style={{ padding: '12px' }}>Occurred At</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => (
                  <tr key={event.id} onClick={() => handleSelectEvent(event)} style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.2s' }} className="hover-row">
                    <td style={{ padding: '12px' }}><strong>{event.eventType}</strong></td>
                    <td style={{ padding: '12px' }}><span style={{ color: 'var(--status-' + event.severity?.toLowerCase() + ')' }}>{event.severity}</span></td>
                    <td style={{ padding: '12px' }}>{event.userIdentifier}</td>
                    <td style={{ padding: '12px' }}>
                      <div>{event.ipAddress}</div>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>{event.device}</div>
                    </td>
                    <td style={{ padding: '12px' }}>{new Date(event.occurredAt).toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>{event.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedEvent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Event Details</h2>
              <button onClick={() => setSelectedEvent(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><X /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div><strong className="text-muted">ID:</strong> <div>{selectedEvent.id}</div></div>
              <div><strong className="text-muted">Type:</strong> <div>{selectedEvent.eventType}</div></div>
              <div><strong className="text-muted">User:</strong> <div>{selectedEvent.userIdentifier}</div></div>
              <div><strong className="text-muted">App ID:</strong> <div>{selectedEvent.applicationId}</div></div>
              <div><strong className="text-muted">Occurred At:</strong> <div>{new Date(selectedEvent.occurredAt).toLocaleString()}</div></div>
              <div><strong className="text-muted">Received At:</strong> <div>{new Date(selectedEvent.receivedAt).toLocaleString()}</div></div>
              <div><strong className="text-muted">IP Address:</strong> <div>{selectedEvent.ipAddress}</div></div>
              <div><strong className="text-muted">Device:</strong> <div>{selectedEvent.device}</div></div>
              <div><strong className="text-muted">Location:</strong> <div>{selectedEvent.location}</div></div>
              <div><strong className="text-muted">Status:</strong> <div>{selectedEvent.status}</div></div>
            </div>

            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '12px' }}>Risk Information</h3>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div><strong className="text-muted">Severity:</strong> <div><span style={{ color: 'var(--status-' + selectedEvent.severity?.toLowerCase() + ')' }}>{selectedEvent.severity}</span></div></div>
                <div><strong className="text-muted">Risk Score:</strong> <div>{selectedEvent.riskScore === null ? 'Not Evaluated' : selectedEvent.riskScore}</div></div>
              </div>
              
              {riskAssessment && (
                <div style={{ marginTop: '16px' }}>
                  <strong className="text-muted">Factors:</strong>
                  <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                    {riskAssessment.factors.map((f, i) => (
                      <li key={i} style={{ marginBottom: '8px' }}>
                        <strong>{f.label} ({f.points} pts):</strong> {f.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <strong className="text-muted">Metadata:</strong>
              <pre style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '6px', overflowX: 'auto', marginTop: '8px' }}>
                {JSON.stringify(selectedEvent.metadata, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityEvents;