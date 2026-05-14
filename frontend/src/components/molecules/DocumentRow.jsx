import React from 'react';
import { FileText } from 'lucide-react';
import DownloadButton from '../atoms/DownloadButton';

function DocumentRow({ name, format, date, href, onDownload }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 0',
        borderBottom: '1px solid #CBD0E0',
      }}
    >
      <div
        style={{
          backgroundColor: '#EEF0FF',
          borderRadius: '8px',
          padding: '8px',
          color: '#3D3FA8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <FileText size={18} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
          {name}
        </span>
        <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
          {format} · {date}
        </span>
      </div>
      <DownloadButton href={href} onClick={onDownload} fileName={name} />
    </div>
  );
}

export default DocumentRow;