import React from 'react';
import { ShieldAlert } from 'lucide-react';

const EmptyState = ({ 
  title = "No results found", 
  message = "There is no data to display here.", 
  description,
  action 
}) => {
  const displayDesc = description || message;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '48px 24px', 
      textAlign: 'center',
      background: 'var(--bg-secondary)',
      border: '1px dashed var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      margin: '8px 0'
    }}>
      <div style={{ 
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)', 
        marginBottom: '16px' 
      }}>
        <ShieldAlert size={28} />
      </div>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '420px', lineHeight: 1.5, marginBottom: action ? '16px' : 0 }}>
        {displayDesc}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
