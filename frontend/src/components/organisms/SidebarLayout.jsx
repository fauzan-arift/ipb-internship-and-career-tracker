import React from 'react';

function SidebarLayout({ sidebar, children }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        minHeight: 'calc(100vh - 57px)',
      }}
    >
      {sidebar}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: '32px 40px',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default SidebarLayout;