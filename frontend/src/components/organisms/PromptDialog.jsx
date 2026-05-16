import React, { useState } from 'react';
import Button from '../atoms/Button';
import TextInput from '../atoms/TextInput';

function PromptDialog({ isOpen, onClose, onSubmit, title = 'Masukkan alasan', placeholder = 'Alasan...', centered = false }) {
  const [value, setValue] = useState('');
  if (!isOpen) return null;

  function submit() {
    if (!value || value.trim() === '') return;
    onSubmit(value.trim());
    setValue('');
  }

  const containerStyle = centered
    ? { position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)' }
    : { position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 60 };
  const boxStyle = { minWidth: 320, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 6px 18px rgba(15,23,42,0.12)', padding: 12 };

  if (centered) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>{title}</div>
          <TextInput value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
            <Button variant="secondary" onClick={() => { setValue(''); onClose && onClose(); }}>Batal</Button>
            <Button variant="primary" onClick={submit}>Ya, Lanjutkan</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>{title}</div>
        <TextInput value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
          <Button variant="secondary" onClick={() => { setValue(''); onClose && onClose(); }}>Batal</Button>
          <Button variant="primary" onClick={submit}>Kirim</Button>
        </div>
      </div>
    </div>
  );
}

export default PromptDialog;
