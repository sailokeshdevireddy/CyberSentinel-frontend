import React from 'react';

const Card = ({ children, className = '', title, subtitle, action, ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {(title || subtitle || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '12px' }}>
          <div>
            {title && <h3 style={{ fontSize: '0.975rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>}
            {subtitle && <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '2px' }}>{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
