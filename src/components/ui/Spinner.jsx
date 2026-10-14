import React from 'react';
import './Spinner.css';

const Spinner = ({ size = 'medium', message }) => {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className="spinner-radar">
        <div className="spinner-core"></div>
      </div>
      {message && <span className="spinner-message">{message}</span>}
    </div>
  );
};

export default Spinner;
