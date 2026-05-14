import React from 'react';

const variants = {
  green: { backgroundColor: '#D6F5E3', color: '#1A6B3A' },
  yellow: { backgroundColor: '#FFF3CD', color: '#856404' },
  red: { backgroundColor: '#FDECEA', color: '#8B1A1A' },
  blue: { backgroundColor: '#EEF0FF', color: '#3D3FA8' },
  gray: { backgroundColor: '#F3F4F6', color: '#6B7280' },
};

function Badge({ children, variant = 'gray' }) {
  const variantStyle = variants[variant] || variants.gray;

  return (
    <span
      style={{
        ...variantStyle,
        padding: '4px 10px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: '600',
        fontFamily: 'Inter, sans-serif',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

export default Badge;