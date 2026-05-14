import React from 'react';

function FormSectionCard({ title, children }) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #CBD0E0',
        overflow: 'hidden',
      }}
    >
      {title && (
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #CBD0E0',
          }}
        >
          <span
            style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#1A1A2E',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {title}
          </span>
        </div>
      )}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {children}
      </div>
    </div>
  );
}

export default FormSectionCard;