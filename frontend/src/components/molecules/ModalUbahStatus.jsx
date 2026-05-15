import React, { useState } from 'react';
import Badge from '../atoms/Badge';
import SelectInput from '../atoms/SelectInput';
import Button from '../atoms/Button';

const STATUS_OPTIONS = [
  { value: 'Melamar Posisi', label: 'Melamar Posisi' },
  { value: 'Diproses', label: 'Diproses' },
  { value: 'Diterima', label: 'Diterima' },
  { value: 'Ditolak', label: 'Ditolak' },
];

function getBadgeVariant(status) {
  if (status === 'Diterima') return 'green';
  if (status === 'Diproses') return 'diproses';
  if (status === 'Ditolak') return 'red';
  if (status === 'Melamar Posisi') return 'pipeline';
  return 'gray';
}

function ModalUbahStatus({ currentStatus, onSave, onClose }) {
  const [selected, setSelected] = useState(currentStatus || '');

  function onSaveHandler() {
    if (selected) onSave(selected);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
          Status Saat Ini:
        </span>
        <Badge variant={getBadgeVariant(currentStatus)}>{currentStatus}</Badge>
      </div>

      <SelectInput
        label="Pilih Status"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        placeholder="Pilih status..."
        options={STATUS_OPTIONS}
      />

      <Button variant="primary" fullWidth onClick={onSaveHandler}>
        Simpan Status
      </Button>
    </div>
  );
}

export default ModalUbahStatus;