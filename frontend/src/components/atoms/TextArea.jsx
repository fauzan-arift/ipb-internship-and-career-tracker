import React from 'react';

function TextArea({ label, placeholder, value, onChange, error, rows = 4, disabled = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        style={{
          padding: '10px 12px',
          borderRadius: '8px',
          border: error ? '1.5px solid #8B1A1A' : '1.5px solid #CBD0E0',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          color: '#1A1A2E',
          backgroundColor: disabled ? '#F5F5F5' : '#FFFFFF',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'text',
          opacity: disabled ? 0.6 : 1,
          width: '100%',
          boxSizing: 'border-box',
          resize: 'vertical',
          lineHeight: '1.5',
        }}
      />
      {error && (
        <span style={{ fontSize: '12px', color: '#8B1A1A', fontFamily: 'Inter, sans-serif' }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default TextArea;