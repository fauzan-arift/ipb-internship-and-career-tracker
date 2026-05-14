import React from 'react';
import { Download } from 'lucide-react';

function DownloadButton({ onClick, href, fileName }) {
  if (href) {
    return (
      <a
        href={href}
        download={fileName}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          border: '1.5px solid #CBD0E0',
          backgroundColor: '#FFFFFF',
          cursor: 'pointer',
          color: '#1A1A2E',
          flexShrink: 0,
          textDecoration: 'none',
        }}
      >
        <Download size={16} />
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        border: '1.5px solid #CBD0E0',
        backgroundColor: '#FFFFFF',
        cursor: 'pointer',
        color: '#1A1A2E',
        flexShrink: 0,
      }}
    >
      <Download size={16} />
    </button>
  );
}

export default DownloadButton;