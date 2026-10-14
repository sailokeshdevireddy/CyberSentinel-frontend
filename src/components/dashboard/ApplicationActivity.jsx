import React from 'react';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import { AppWindow, Clock } from 'lucide-react';

const ApplicationActivity = ({ applications = [] }) => {
  return (
    <Card 
      title="Application Activity" 
      subtitle="Protected endpoints & ingestion status"
      className="app-activity-card"
    >
      <div className="app-activity-list">
        {applications.length === 0 ? (
          <div className="empty-state-small" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No applications registered.
          </div>
        ) : (
          applications.map(app => (
            <div key={app.id} className="app-activity-item">
              <div className="app-icon-wrapper">
                <AppWindow size={16} className="app-icon" />
              </div>
              <div className="app-info">
                <div className="app-name">{app.name}</div>
                <div className="app-meta">
                  <Clock size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                  {app.lastEventAt ? new Date(app.lastEventAt).toLocaleDateString() : 'No events yet'}
                </div>
              </div>
              <div className="app-status">
                <StatusBadge status={app.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default ApplicationActivity;
