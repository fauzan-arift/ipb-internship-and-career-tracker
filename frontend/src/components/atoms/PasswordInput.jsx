import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function PasswordInput({ label, placeholder, value, onChange, hint, error, disabled = false }) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{
            padding: '10px 40px 10px 12px',
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
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6B7280',
            display: 'flex',
            alignItems: 'center',
            padding: '0',
          }}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
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

export default PasswordInput;