import React, { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';

function UploadZone({ onChange, hint, error, accept, file, existingFileUrl, existingFileName }) {
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const inputRef = useRef(null);

  const hasNewFile = !!file;
  const hasExistingFile = !hasNewFile && !!existingFileUrl;
  const hasAnyFile = hasNewFile || hasExistingFile;

  const displayName = hasNewFile
    ? file.name
    : hasExistingFile
      ? (existingFileName || existingFileUrl.split('/').pop())
      : null;

  const displaySize = hasNewFile
    ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    : null;

  function handleFile(newFile) {
    if (!newFile) return;
    if (onChange) onChange(newFile);
  }

  function onClickHandler() {
    if (hasExistingFile && existingFileUrl) {
      window.open(existingFileUrl, '_blank', 'noopener,noreferrer');
    } else if (hasNewFile && file) {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      inputRef.current.click();
    }
  }

  function onChangeHandler(event) {
    handleFile(event.target.files[0]);
    event.target.value = '';
  }

  function onDragOverHandler(event) {
    event.preventDefault();
    setDragging(true);
  }

  function onDragLeaveHandler() {
    setDragging(false);
  }

  function onDropHandler(event) {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files[0]);
  }

  function onRemove(e) {
    e.stopPropagation();
    if (onChange) onChange(null);
  }

  const isActive = dragging || hovering;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div
        onClick={onClickHandler}
        onDragOver={onDragOverHandler}
        onDragLeave={onDragLeaveHandler}
        onDrop={onDropHandler}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{
          border: error
            ? '1.5px dashed #8B1A1A'
            : isActive
              ? '1.5px dashed #3D3FA8'
              : hasAnyFile
                ? '1.5px solid #CBD0E0'
                : '1.5px dashed #CBD0E0',
          borderRadius: '8px',
          backgroundColor: isActive ? '#EEF0FF' : '#FAFAFA',
          padding: hasAnyFile ? '12px 16px' : '24px',
          display: 'flex',
          alignItems: 'center',
          flexDirection: hasAnyFile ? 'row' : 'column',
          gap: hasAnyFile ? '12px' : '8px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onChangeHandler}
          style={{ display: 'none' }}
        />

        {hasAnyFile ? (
          <>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              backgroundColor: '#FDECEA', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <FileText size={18} color="#DC2626" />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
              <span style={{
                fontSize: '13px', fontWeight: '600',
                color: hasExistingFile ? '#3D3FA8' : '#1A1A2E',
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                textDecoration: hasExistingFile ? 'underline' : 'none',
              }}>
                {displayName}
              </span>
              <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                {hasNewFile
                  ? `${displaySize} · drag & drop untuk ganti`
                  : 'File tersimpan · klik untuk buka, drag & drop untuk ganti'
                }
              </span>
            </div>

            <button
              type="button"
              onClick={onRemove}
              title="Hapus file"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#6B7280', padding: '4px', display: 'flex',
                alignItems: 'center', borderRadius: '4px', flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#DC2626'}
              onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <>
            <Upload size={24} color={isActive ? '#3D3FA8' : '#6B7280'} />
            <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
              Drag & drop atau{' '}
              <span style={{ color: '#3D3FA8', fontWeight: '600' }}>klik untuk upload</span>
            </span>
            {hint && (
              <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                {hint}
              </span>
            )}
          </>
        )}
      </div>

      {error && (
        <span style={{ fontSize: '12px', color: '#8B1A1A', fontFamily: 'Inter, sans-serif' }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default UploadZone;