import React from 'react';

function DescriptionBox({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
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
      )}
      <div
        style={{
          padding: '12px',
          borderRadius: '8px',
          border: '1.5px solid #CBD0E0',
          fontSize: '14px',
          color: '#1A1A2E',
          fontFamily: 'Inter, sans-serif',
          lineHeight: '1.6',
          backgroundColor: '#FAFAFA',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {value || '-'}
      </div>
    </div>
  );
}

export default DescriptionBox;