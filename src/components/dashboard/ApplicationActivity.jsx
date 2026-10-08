import React from 'react';
import Card from '../ui/Card';
import StatusBadge from '../ui/StatusBadge';
import { Activity } from 'lucide-react';

const ApplicationActivity = ({ applications }) => {
  return (
    <Card title="Application Activity" className="app-activity-card">
      <div className="app-activity-list">
        {applications.length === 0 ? (
          <div className="empty-state-small">No applications found.</div>
        ) : (
          applications.map(app => (
            <div key={app.id} className="app-activity-item">
              <div className="app-icon-wrapper">
                <Activity size={18} className="app-icon" />
              </div>
              <div className="app-info">
                <div className="app-name">{app.name}</div>
                <div className="app-meta">Last event: {app.lastEventAt ? new Date(app.lastEventAt).toLocaleDateString() : 'N/A'}</div>
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
