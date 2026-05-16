import React from 'react';
import Button from '../atoms/Button';

function InlineConfirmation({ isOpen, onClose, onConfirm, title = 'Konfirmasi', message }) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 60 }}>
      <div style={{ minWidth: 260, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 6px 18px rgba(15,23,42,0.12)', padding: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 13, color: '#374151', marginBottom: 12 }}>{message}</div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={onConfirm}>Ya</Button>
        </div>
      </div>
    </div>
  );
}

export default InlineConfirmation;
