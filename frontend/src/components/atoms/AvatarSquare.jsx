import React, { useState } from 'react';

function AvatarSquare({ name, imageSrc = null, alt = '', bg = '#3D3FA8', color = '#FFFFFF', size = 40 }) {
  const [imageFailed, setImageFailed] = useState(false);
  const safeName = name || '?';
  const initials = safeName
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

  const shouldShowImage = Boolean(imageSrc) && !imageFailed;

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
        overflow: 'hidden',
      }}
    >
      {shouldShowImage ? (
        <img
          src={imageSrc}
          alt={alt || safeName}
          onError={() => setImageFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        initials
      )}
    </div>
  );
}

export default AvatarSquare;