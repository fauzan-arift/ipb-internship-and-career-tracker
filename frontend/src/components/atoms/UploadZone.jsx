import React, { useState, useRef } from 'react';
import { Upload, FileText } from 'lucide-react';

function UploadZone({ label, onChange, hint, error, accept }) {
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const inputRef = useRef(null);

  function handleFile(file) {
    if (!file) return;
    setFileName(file.name);
    if (onChange) onChange(file);
  }

  function onClickHandler() {
    inputRef.current.click();
  }

  function onChangeHandler(event) {
    handleFile(event.target.files[0]);
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

  const isActive = dragging || hovering;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
          {label}
        </label>
      )}
      <div
        onClick={onClickHandler}
        onDragOver={onDragOverHandler}
        onDragLeave={onDragLeaveHandler}
        onDrop={onDropHandler}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{
          border: error ? '1.5px dashed #8B1A1A' : isActive ? '1.5px dashed #3D3FA8' : '1.5px dashed #CBD0E0',
          borderRadius: '8px',
          backgroundColor: isActive ? '#EEF0FF' : '#FAFAFA',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
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
        {fileName ? (
          <>
            <FileText size={24} color="#3D3FA8" />
            <span style={{ fontSize: '13px', color: '#3D3FA8', fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
              {fileName}
            </span>
            <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              Klik untuk ganti file
            </span>
          </>
        ) : (
          <>
            <Upload size={24} color={isActive ? '#3D3FA8' : '#6B7280'} />
            <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              Drag & drop atau <span style={{ color: '#3D3FA8', fontWeight: '600' }}>klik untuk upload</span>
            </span>
          </>
        )}
      </div>
      {hint && !error && (
        <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
          {hint}
        </span>
      )}
      {error && (
        <span style={{ fontSize: '12px', color: '#8B1A1A', fontFamily: 'Inter, sans-serif' }}>
          {error}
        </span>
      )}
    </div>
  );
}

export default UploadZone;