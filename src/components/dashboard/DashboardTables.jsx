import React from 'react';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';

const SeverityBadge = ({ severity }) => {
  const sevKey = (severity || 'neutral').toLowerCase();
  return <span className={`badge badge-${sevKey}`}>{severity || 'UNKNOWN'}</span>;
};

const RiskScoreBadge = ({ score }) => {
  if (score === null || score === undefined) {
    return <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>N/A</span>;
  }
  
  let color = 'var(--text-secondary)';
  if (score >= 80) color = 'var(--status-critical)';
  else if (score >= 60) color = 'var(--status-high)';
  else if (score >= 40) color = 'var(--status-medium)';
  else color = 'var(--status-low)';

  return (
    <span style={{ 
      fontWeight: 700, 
      fontFamily: 'var(--font-mono, monospace)', 
      color,
      fontSize: '0.875rem' 
    }}>
      {score}
    </span>
  );
};

export const RecentEventsTable = ({ events = [] }) => {
  return (
    <Card 
      title="Recent Security Events" 
      subtitle="Latest raw security telemetries received"
      className="table-card"
    >
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Risk Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr><td colSpan="5" className="text-center empty-cell">No recent events detected</td></tr>
            ) : (
              events.map(event => (
                <tr key={event.id} className="hover-row">
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {new Date(event.occurredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="font-medium">
                    <code>{event.eventType ? event.eventType.replace(/_/g, ' ') : 'EVENT'}</code>
                  </td>
                  <td><SeverityBadge severity={event.severity} /></td>
                  <td><RiskScoreBadge score={event.riskScore} /></td>
                  <td><StatusBadge status={event.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export const RecentThreatsTable = ({ threats = [] }) => {
  return (
    <Card 
      title="Active Threats" 
      subtitle="Correlated attack vectors requiring attention"
      className="table-card"
    >
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Severity</th>
              <th>Risk Score</th>
              <th>Related Events</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {threats.length === 0 ? (
              <tr><td colSpan="5" className="text-center empty-cell">No active threats detected</td></tr>
            ) : (
              threats.map(threat => (
                <tr key={threat.id} className="hover-row">
                  <td className="font-medium">
                    <code>{threat.type ? threat.type.replace(/_/g, ' ') : 'THREAT'}</code>
                  </td>
                  <td><SeverityBadge severity={threat.severity} /></td>
                  <td><RiskScoreBadge score={threat.riskScore} /></td>
                  <td>
                    <span className="count-pill">
                      {threat.relatedEventIds?.length || 0} events
                    </span>
                  </td>
                  <td><StatusBadge status={threat.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export const RecentIncidentsTable = ({ incidents = [] }) => {
  return (
    <Card 
      title="Recent Incidents" 
      subtitle="Escalated security cases underway"
      className="table-card"
    >
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Severity</th>
              <th>Risk Score</th>
              <th>Related Threats</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.length === 0 ? (
              <tr><td colSpan="5" className="text-center empty-cell">No recent incidents recorded</td></tr>
            ) : (
              incidents.map(incident => (
                <tr key={incident.id} className="hover-row">
                  <td className="font-medium">
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{incident.title}</span>
                  </td>
                  <td><SeverityBadge severity={incident.severity} /></td>
                  <td><RiskScoreBadge score={incident.riskScore} /></td>
                  <td>
                    <span className="count-pill">
                      {incident.relatedThreatIds?.length || 0} threats
                    </span>
                  </td>
                  <td><StatusBadge status={incident.status} /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
