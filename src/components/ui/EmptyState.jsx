import React from 'react';
import { FileQuestion } from 'lucide-react';

const EmptyState = ({ title = "No results found", description = "There is no data to display here." }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
        <FileQuestion size={48} />
      </div>
      <h3 style={{ fontSize: '1.125rem', color: 'var(--text-primary)', marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)' }}>{description}</p>
    </div>
  );
};

export default EmptyState;
