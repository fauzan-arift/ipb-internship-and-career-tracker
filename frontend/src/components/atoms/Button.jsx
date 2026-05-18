import React from 'react';

function Button({ children, variant = 'primary', size = 'default', fullWidth = false, disabled = false, onClick, type = 'button' }) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '8px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    border: 'none',
    transition: 'opacity 0.2s',
    width: fullWidth ? '100%' : 'auto',
  };

  const sizes = {
    default: { padding: '10px 20px', fontSize: '14px' },
    sm: { padding: '6px 14px', fontSize: '13px' },
    lg: { padding: '14px 16px', fontSize: '16px' },
  };

  const variants = {
    primary: {
      backgroundColor: '#3D3FA8',
      color: '#FFFFFF',
      border: 'none',
    },
    secondary: {
      backgroundColor: '#FFFFFF',
      color: '#3D3FA8',
      border: '1.5px solid #3D3FA8',
    },
    danger: {
      backgroundColor: '#FDECEA',
      color: '#8B1A1A',
      border: 'none',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#3D3FA8',
      border: 'none',
    },
    success: {
      backgroundColor: '#1A6B3A',
      color: '#FFFFFF',
      border: 'none',
    },
  };

  const style = {
    ...base,
    ...sizes[size],
    ...variants[variant],
  };

  return (
    <button
      type={type}
      style={style}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;