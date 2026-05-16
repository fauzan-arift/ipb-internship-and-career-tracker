import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

function PasswordInput({ label, placeholder, value, onChange, hint, error, disabled = false, ...rest }) {
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
          className={`w-full px-4 py-3.5 rounded-lg border text-base outline-none focus:border-[#4D44B5] focus:ring-1 focus:ring-[#4D44B5] transition-colors pr-12 ${
            error
              ? 'border-red-400'
              : 'border-[#CBD0E0]'
          } ${
            disabled
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
              : 'bg-white text-black'
          }`}
          {...rest}
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
        <span className="text-red-500 text-xs">
          {error}
        </span>
      )}
    </div>
  );
}

export default PasswordInput;