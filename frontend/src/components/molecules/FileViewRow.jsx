import React from 'react';
import { FileText, Download } from 'lucide-react';

function FileViewRow({ fileName, fileSize, uploadedAt, href }) {
  function handleOpen(e) {
    e.preventDefault();
    if (href) window.open(href, '_blank', 'noopener,noreferrer');
  }

  const formattedDate = uploadedAt
    ? new Date(uploadedAt).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 14px', borderRadius: '10px',
      border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '8px',
        backgroundColor: '#FDECEA', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <FileText size={20} color="#DC2626" />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
        <span
          onClick={handleOpen}
          style={{
            fontSize: '13px', fontWeight: '600', color: href ? '#3D3FA8' : '#1A1A2E',
            fontFamily: 'Inter, sans-serif', cursor: href ? 'pointer' : 'default',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}
          title={fileName}
        >
          {fileName || 'Dokumen'}
        </span>
        {(fileSize || formattedDate) && (
          <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            {[fileSize, formattedDate ? `Diunggah ${formattedDate}` : null].filter(Boolean).join(' · ')}
          </span>
        )}
      </div>

      {href && (
        <button
          type="button"
          onClick={handleOpen}
          title="Buka di tab baru"
          style={{
            width: '32px', height: '32px', borderRadius: '8px',
            backgroundColor: '#EEF0FF', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0, transition: 'background-color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D4D7F5'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EEF0FF'}
        >
          <Download size={15} color="#3D3FA8" />
        </button>
      )}
    </div>
  );
}

export default FileViewRow;