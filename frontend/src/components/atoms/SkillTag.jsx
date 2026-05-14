import React from 'react';

function SkillTag({ label }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: '20px',
        border: '1px solid #CBD0E0',
        backgroundColor: '#FFFFFF',
        color: '#1A1A2E',
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

export default SkillTag;