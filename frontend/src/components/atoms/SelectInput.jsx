import React from 'react';
import { ChevronDown } from 'lucide-react';

function SelectInput({ label, value, onChange, options = [], placeholder, hint, error, disabled = false, name }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          style={{
            padding: '10px 40px 10px 12px',
            borderRadius: '8px',
            border: error ? '1.5px solid #8B1A1A' : '1.5px solid #CBD0E0',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            color: value ? '#1A1A2E' : '#6B7280',
            backgroundColor: disabled ? '#F5F5F5' : '#FFFFFF',
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
            width: '100%',
            boxSizing: 'border-box',
            appearance: 'none',
          }}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: '#6B7280',
          display: 'flex',
          alignItems: 'center',
        }}>
          <ChevronDown size={16} />
        </div>
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

export default SelectInput;