import React from 'react';

const Card = ({ children, className = '', title }) => {
  return (
    <div className={`card ${className}`}>
      {title && <h3 style={{ marginBottom: '16px', fontSize: '1rem', fontWeight: 600 }}>{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
