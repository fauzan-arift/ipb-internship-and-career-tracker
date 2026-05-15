import React from 'react';
import Button from '../atoms/Button';

function FormActionBar({ onCancel, onSubmit, cancelLabel = 'Batal', submitLabel = 'Simpan', submitIcon, disabled = false }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '8px',
        paddingTop: '16px',
      }}
    >
      <Button variant="secondary" onClick={onCancel} type="button">
        {cancelLabel}
      </Button>
      <Button variant="primary" onClick={onSubmit} type="submit" disabled={disabled}>
        {submitIcon && submitIcon}
        {submitLabel}
      </Button>
    </div>
  );
}

export default FormActionBar;