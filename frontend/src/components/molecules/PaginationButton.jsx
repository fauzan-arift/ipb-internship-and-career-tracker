import React from 'react';

function PaginationButton({ page, isActive, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '6px',
        border: isActive ? 'none' : '1.5px solid #CBD0E0',
        backgroundColor: isActive ? '#3D3FA8' : 'transparent',
        color: isActive ? '#FFFFFF' : '#1A1A2E',
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: isActive ? '600' : '400',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {page}
    </button>
  );
}

export default PaginationButton;