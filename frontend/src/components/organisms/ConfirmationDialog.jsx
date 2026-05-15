import React from 'react';
import Button from '../atoms/Button';

function ConfirmationDialog({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button variant="primary" onClick={onConfirm}>
            Ya, Lanjutkan
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;