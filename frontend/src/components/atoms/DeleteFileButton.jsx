import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

function DeleteFileButton({ onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        border: hovered ? '1.5px solid #8B1A1A' : '1.5px solid #CBD0E0',
        backgroundColor: '#FFFFFF',
        color: hovered ? '#8B1A1A' : '#6B7280',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'all 0.15s',
        padding: 0,
      }}
    >
      <Trash2 size={14} />
    </button>
  );
}

export default DeleteFileButton;