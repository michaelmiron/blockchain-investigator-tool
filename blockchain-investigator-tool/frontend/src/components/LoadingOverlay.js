import React from 'react';
import '../styles/LoadingOverlay.css';

export default function LoadingOverlay() {
  return (
    <div className="loading-overlay">
      <div className="spinner">Loading...</div>
    </div>
  );
}