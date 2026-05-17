import React, { useState } from 'react';

function AvatarSquare({ name, imageUrl, bg = '#3D3FA8', color = '#FFFFFF', size = 40 }) {
  const [hasError, setHasError] = useState(false);
  
  // 🛡️ Guard: Jika name undefined/null/empty, pakai '?'
  const safeName = name || '?';
  const initials = safeName
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

  if (imageUrl && !hasError) {
    return (
      <img
        src={imageUrl}
        alt={safeName}
        onError={() => setHasError(true)}
        style={{
          width: size,
          height: size,
          borderRadius: '8px',
          objectFit: 'cover',
          border: '1px solid #E5E7EB',
          flexShrink: 0,
        }}
      />
    );
  }

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