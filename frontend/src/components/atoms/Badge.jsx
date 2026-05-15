import React from 'react';

const variants = {
  green: { backgroundColor: '#D6F5E3', color: '#1A6B3A' },
  yellow: { backgroundColor: '#FFF3CD', color: '#856404' },
  red: { backgroundColor: '#FDECEA', color: '#8B1A1A' },
  blue: { backgroundColor: '#EEF0FF', color: '#3D3FA8' },
  gray: { backgroundColor: '#F3F4F6', color: '#6B7280' },
  hybrid: { backgroundColor: '#FFF9E6', color: '#92610A' },
  wfo: { backgroundColor: '#EEF0FF', color: '#3D3FA8' },
  wfa: { backgroundColor: '#E8F5EE', color: '#1A6B3A' },
  diproses: { backgroundColor: '#F3EEFF', color: '#6B21A8' },
  pipeline: { backgroundColor: '#FFF3CD', color: '#856404' },
  orange: { backgroundColor: '#FFEDD5', color: '#9A3412' },
  teal: { backgroundColor: '#E0F2F1', color: '#004D40' },
  indigo: { backgroundColor: '#E0E7FF', color: '#3730A3' },
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
        fontWeight: '500',
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