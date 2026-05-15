import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, title, children }) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 100,
          }}
        />
        <Dialog.Content
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '480px',
            boxSizing: 'border-box',
            zIndex: 101,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: title ? '20px' : '0' }}>
            {title && (
              <Dialog.Title
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1A1A2E',
                  fontFamily: 'Inter, sans-serif',
                  margin: 0,
                }}
              >
                {title}
              </Dialog.Title>
            )}
            <Dialog.Close asChild>
              <button
                type="button"
                onClick={onClose}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  borderRadius: '4px',
                }}
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;