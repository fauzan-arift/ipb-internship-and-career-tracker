import React from 'react';

function TimelineDot({ active = false }) {
  return (
    <div
      style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        flexShrink: 0,
        backgroundColor: active ? '#3D3FA8' : '#FFFFFF',
        border: active ? 'none' : '2px solid #CBD0E0',
        boxSizing: 'border-box',
      }}
    />
  );
}

export default TimelineDot;