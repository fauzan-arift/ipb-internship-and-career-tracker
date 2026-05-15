import React from 'react';

function PageFooter() {
  return (
    <footer
      style={{
        borderTop: '1px solid #CBD0E0',
        padding: '16px 24px',
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
      }}
    >
      <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
        © 2026 IPB Internship Portal. All rights reserved.
      </span>
    </footer>
  );
}

export default PageFooter;