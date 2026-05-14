import React from 'react';

function TextInput({ label, placeholder, value, onChange, hint, error, type = 'text', disabled = false, ...rest }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
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
        }}
        {...rest}
      />
      {hint && !error && (
        <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
          {hint}
        </span>
      )}
      {error && (
        <span style={{ fontSize: '12px', color: '#8B1A1A', fontFamily: 'Inter, sans-serif' }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default TextInput;