import React from 'react';
import Card from '../ui/Card';

const MetricCard = ({ title, value, icon: Icon, trend, trendLabel, critical }) => {
  return (
    <Card className={`metric-card ${critical ? 'critical-metric' : ''}`}>
      <div className="metric-header">
        <span className="metric-title">{title}</span>
        {Icon && (
          <div className={`metric-icon-box ${critical ? 'critical-icon-box' : ''}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="metric-content">
        <div className="metric-value">
          {value !== undefined && value !== null ? value : '—'}
        </div>
        {trend !== undefined && trend !== null && (
          <div className="metric-trend">
            <span className={`trend-badge ${trend > 0 ? 'trend-up' : trend < 0 ? 'trend-down' : 'trend-neutral'}`}>
              {trend > 0 ? '↑' : trend < 0 ? '↓' : '−'} {Math.abs(trend)}%
            </span>
            {trendLabel && <span className="trend-label">{trendLabel}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MetricCard;
