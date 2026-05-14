import React from 'react';

function AuthCard({ title, subtitle, children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#EEF0F8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #CBD0E0',
          padding: '40px',
          width: '100%',
          maxWidth: '440px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#3D3FA8',
              fontFamily: 'Inter, sans-serif',
              display: 'block',
              marginBottom: '4px',
            }}
          >
            IPB Internship Portal
          </span>
          {title && (
            <h1
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#1A1A2E',
                fontFamily: 'Inter, sans-serif',
                margin: '12px 0 0',
              }}
            >
              {title}
            </h1>
          )}
          {subtitle && (
            <p
              style={{
                fontSize: '14px',
                color: '#6B7280',
                fontFamily: 'Inter, sans-serif',
                margin: '6px 0 0',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export default AuthCard;