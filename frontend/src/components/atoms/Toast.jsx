import React, { useEffect } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999,
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        border: `1.5px solid ${isSuccess ? '#1A6B3A' : '#8B1A1A'}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '280px',
        maxWidth: '360px',
        animation: 'slideIn 0.2s ease',
      }}
    >
      {isSuccess
        ? <CheckCircle size={20} color="#1A6B3A" style={{ flexShrink: 0 }} />
        : <XCircle size={20} color="#8B1A1A" style={{ flexShrink: 0 }} />
      }
      <span
        style={{
          flex: 1,
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          color: '#1A1A2E',
          lineHeight: '1.4',
        }}
      >
        {message}
      </span>
      <button
        type="button"
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#6B7280',
          display: 'flex',
          alignItems: 'center',
          padding: '0',
          flexShrink: 0,
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default Toast;