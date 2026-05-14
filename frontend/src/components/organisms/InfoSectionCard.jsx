import React from 'react';

function InfoSectionCard({ title, icon, children }) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #CBD0E0',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid #CBD0E0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        {icon && (
          <div style={{ color: '#3D3FA8', display: 'flex', alignItems: 'center' }}>
            {icon}
          </div>
        )}
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
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {children}
      </div>
    </div>
  );
}

export default InfoSectionCard;