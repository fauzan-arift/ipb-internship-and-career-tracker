import React from 'react';

function StatCard({ label, value, icon }) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #CBD0E0',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flex: 1,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
            fontSize: '28px',
            fontWeight: '700',
            color: '#1A1A2E',
            fontFamily: 'Inter, sans-serif',
            lineHeight: '1.2',
          }}
        >
          {value}
        </span>
      </div>
      {icon && (
        <div
          style={{
            backgroundColor: '#EEF0FF',
            borderRadius: '8px',
            padding: '10px',
            color: '#3D3FA8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}
    </div>
  );
}

export default StatCard;