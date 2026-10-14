import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

const ErrorState = ({ message = "An error occurred while loading data.", onRetry }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '40px 24px', 
      background: 'var(--status-critical-bg)',
      border: '1px solid var(--status-critical-border)',
      borderRadius: 'var(--radius-lg)',
      textAlign: 'center',
      margin: '12px 0'
    }}>
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--status-critical)',
        marginBottom: '16px'
      }}>
        <AlertCircle size={28} />
      </div>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
        Security Operations Alert
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: onRetry ? '18px' : 0, maxWidth: '440px', lineHeight: 1.5 }}>
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          <RefreshCw size={14} style={{ marginRight: '6px' }} /> Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
