import React from 'react';
import { ArrowLeft } from 'lucide-react';

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        border: '1.5px solid #CBD0E0',
        backgroundColor: '#FFFFFF',
        cursor: 'pointer',
        color: '#1A1A2E',
        flexShrink: 0,
      }}
    >
      <ArrowLeft size={16} />
    </button>
  );
}

export default BackButton;