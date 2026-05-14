import React from 'react';

function FieldDisplay({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span
        style={{
          fontSize: '11px',
          fontWeight: '600',
          color: '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '14px',
          color: '#1A1A2E',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {value || '-'}
      </span>
    </div>
  );
}

export default FieldDisplay;