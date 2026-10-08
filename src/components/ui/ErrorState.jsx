import React from 'react';
import { AlertCircle } from 'lucide-react';
import Button from './Button';

const ErrorState = ({ message = "An error occurred while loading data.", onRetry }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: 'var(--status-critical)' }}>
      <AlertCircle size={48} style={{ marginBottom: '16px' }} />
      <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>Something went wrong</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{message}</p>
      {onRetry && <Button onClick={onRetry} variant="secondary">Try Again</Button>}
    </div>
  );
};

export default ErrorState;
