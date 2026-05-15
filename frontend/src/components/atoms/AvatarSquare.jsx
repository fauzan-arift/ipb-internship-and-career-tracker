import React from 'react';

function AvatarSquare({ name, bg = '#3D3FA8', color = '#FFFFFF', size = 40 }) {
  // 🛡️ Guard: Jika name undefined/null/empty, pakai '?'
  const safeName = name || '?';
  const initials = safeName
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '8px',
        backgroundColor: bg,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.35,
        fontWeight: '700',
        fontFamily: 'Inter, sans-serif',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

export default AvatarSquare;