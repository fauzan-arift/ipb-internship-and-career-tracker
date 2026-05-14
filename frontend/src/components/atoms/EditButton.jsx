import React, { useState } from 'react';
import { Pencil } from 'lucide-react';

function EditButton({ onClick }) {
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
        border: hovered ? '1.5px solid #3D3FA8' : '1.5px solid #CBD0E0',
        backgroundColor: '#FFFFFF',
        color: hovered ? '#3D3FA8' : '#6B7280',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'all 0.15s',
        padding: 0,
      }}
    >
      <Pencil size={14} />
    </button>
  );
}

export default EditButton;