import React from 'react';

function SidebarLayout({ sidebar, children }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      <div style={{ flexShrink: 0 }}>
        {sidebar}
      </div>
      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          padding: '32px 40px',
          boxSizing: 'border-box',
          overflow: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default SidebarLayout;