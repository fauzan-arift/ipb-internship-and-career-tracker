import React from 'react';
import { FileText } from 'lucide-react';
import DeleteFileButton from '../atoms/DeleteFileButton';

function UploadedFileRow({ fileName, fileSize, onDelete }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #CBD0E0',
      }}
    >
      <div style={{ color: '#6B7280', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <FileText size={18} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
          {fileName}
        </span>
        {fileSize && (
          <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            {fileSize}
          </span>
        )}
      </div>
      <DeleteFileButton onClick={onDelete} />
    </div>
  );
}

export default UploadedFileRow;