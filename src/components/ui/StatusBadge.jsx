import React from 'react';

const StatusBadge = ({ status }) => {
  // Map locked enums to colors
  const getColor = () => {
    switch(status) {
      case 'CRITICAL': return 'var(--status-critical)';
      case 'HIGH': return 'var(--status-high)';
      case 'MEDIUM': return 'var(--status-medium)';
      case 'LOW': return 'var(--status-low)';
      case 'ACTIVE':
      case 'LOGIN_SUCCESS':
      case 'RESOLVED': return 'var(--status-success)';
      case 'INACTIVE':
      case 'LOGIN_FAILED': return 'var(--status-critical)';
      default: return 'var(--text-muted)';
    }
  };

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    backgroundColor: `${getColor()}20`, // 20% opacity background
    color: getColor(),
    border: `1px solid ${getColor()}40`
  };

  return (
    <span style={badgeStyle}>
      {status ? status.replace(/_/g, ' ') : 'UNKNOWN'}
    </span>
  );
};

export default StatusBadge;
