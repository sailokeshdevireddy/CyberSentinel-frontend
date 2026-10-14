import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeConfig = () => {
    switch(status) {
      case 'CRITICAL': 
        return { 
          bg: 'var(--status-critical-bg)', 
          color: 'var(--status-critical)', 
          border: 'var(--status-critical-border)' 
        };
      case 'HIGH': 
        return { 
          bg: 'var(--status-high-bg)', 
          color: 'var(--status-high)', 
          border: 'var(--status-high-border)' 
        };
      case 'MEDIUM': 
        return { 
          bg: 'var(--status-medium-bg)', 
          color: 'var(--status-medium)', 
          border: 'var(--status-medium-border)' 
        };
      case 'LOW': 
        return { 
          bg: 'var(--status-low-bg)', 
          color: 'var(--status-low)', 
          border: 'var(--status-low-border)' 
        };
      case 'ACTIVE':
      case 'LOGIN_SUCCESS':
      case 'RESOLVED': 
      case 'CLOSED':
        return { 
          bg: 'var(--status-success-bg)', 
          color: 'var(--status-success)', 
          border: 'var(--status-success-border)' 
        };
      case 'INACTIVE':
      case 'LOGIN_FAILED': 
        return { 
          bg: 'var(--status-critical-bg)', 
          color: 'var(--status-critical)', 
          border: 'var(--status-critical-border)' 
        };
      case 'OPEN':
      case 'RECEIVED':
        return { 
          bg: 'var(--status-low-bg)', 
          color: 'var(--status-low)', 
          border: 'var(--status-low-border)' 
        };
      case 'INVESTIGATING':
      case 'ANALYZED':
      case 'ACKNOWLEDGED':
        return { 
          bg: 'var(--status-medium-bg)', 
          color: 'var(--status-medium)', 
          border: 'var(--status-medium-border)' 
        };
      case 'ESCALATED':
        return { 
          bg: 'var(--status-high-bg)', 
          color: 'var(--status-high)', 
          border: 'var(--status-high-border)' 
        };
      default: 
        return { 
          bg: 'var(--hover-color)', 
          color: 'var(--text-secondary)', 
          border: 'var(--border-color)' 
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span 
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '0.725rem',
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        letterSpacing: '0.3px',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap'
      }}
    >
      <span 
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.color,
          flexShrink: 0
        }}
      />
      {status ? status.replace(/_/g, ' ') : 'UNKNOWN'}
    </span>
  );
};

export default StatusBadge;
