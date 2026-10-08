import React from 'react';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';

const SeverityBadge = ({ severity }) => {
  const colors = {
    LOW: 'badge-success',
    MEDIUM: 'badge-warning',
    HIGH: 'badge-danger',
    CRITICAL: 'badge-critical'
  };
  return <span className={`badge ${colors[severity] || 'badge-neutral'}`}>{severity}</span>;
};

export const RecentEventsTable = ({ events }) => {
  return (
    <Card title="Recent Security Events" className="table-card">
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
              <tr><td colSpan="5" className="text-center empty-cell">No recent events</td></tr>
            ) : (
              events.map(event => (
                <tr key={event.id}>
                  <td>{new Date(event.occurredAt).toLocaleTimeString()}</td>
                  <td className="font-medium">{event.eventType.replace(/_/g, ' ')}</td>
                  <td><SeverityBadge severity={event.severity} /></td>
                  <td>{event.riskScore !== null ? event.riskScore : 'N/A'}</td>
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

export const RecentThreatsTable = ({ threats }) => {
  return (
    <Card title="Active Threats" className="table-card">
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
              <tr><td colSpan="5" className="text-center empty-cell">No active threats</td></tr>
            ) : (
              threats.map(threat => (
                <tr key={threat.id}>
                  <td className="font-medium">{threat.type.replace(/_/g, ' ')}</td>
                  <td><SeverityBadge severity={threat.severity} /></td>
                  <td>{threat.riskScore}</td>
                  <td>{threat.relatedEventIds?.length || 0}</td>
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

export const RecentIncidentsTable = ({ incidents }) => {
  return (
    <Card title="Recent Incidents" className="table-card">
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
              <tr><td colSpan="5" className="text-center empty-cell">No recent incidents</td></tr>
            ) : (
              incidents.map(incident => (
                <tr key={incident.id}>
                  <td className="font-medium">{incident.title}</td>
                  <td><SeverityBadge severity={incident.severity} /></td>
                  <td>{incident.riskScore}</td>
                  <td>{incident.relatedThreatIds?.length || 0}</td>
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
