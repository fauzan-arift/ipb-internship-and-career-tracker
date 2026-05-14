import React from 'react';

function TwoColumnDetailLayout({ left, right }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          flex: '0 0 65%',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          minWidth: 0,
        }}
      >
        {left}
      </div>
      <div
        style={{
          flex: '0 0 calc(35% - 24px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          minWidth: 0,
        }}
      >
        {right}
      </div>
    </div>
  );
}

export default TwoColumnDetailLayout;