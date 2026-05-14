import React from 'react';

function ContactRow({ icon, value }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <div
        style={{
          color: '#6B7280',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
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

export default ContactRow;