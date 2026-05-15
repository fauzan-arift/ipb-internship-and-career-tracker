import React from 'react';

function SingleStatCard({ label, value }) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #CBD0E0',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <span
        style={{
          fontSize: '13px',
          color: '#6B7280',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1A1A2E',
          fontFamily: 'Inter, sans-serif',
          lineHeight: '1.2',
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default SingleStatCard;