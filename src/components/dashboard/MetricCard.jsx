import React from 'react';
// No external Card.css import, relying on global or Card.jsx included styles
import Card from '../ui/Card';

const MetricCard = ({ title, value, icon: Icon, trend, trendLabel, critical }) => {
  return (
    <Card className={`metric-card ${critical ? 'critical-metric' : ''}`}>
      <div className="metric-header">
        <h3 className="metric-title">{title}</h3>
        {Icon && <Icon className="metric-icon" size={20} />}
      </div>
      <div className="metric-content">
        <div className="metric-value">{value}</div>
        {trend && (
          <div className="metric-trend">
            <span className={trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-neutral'}>
              {trend > 0 ? '↑' : trend < 0 ? '↓' : '−'} {Math.abs(trend)}%
            </span>
            <span className="trend-label">{trendLabel}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;
