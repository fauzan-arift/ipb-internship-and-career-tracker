import React from 'react';

function RoleSelector({ value, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <span style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
        Daftar sebagai
      </span>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          type="button"
          onClick={() => onChange('mahasiswa')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: value === 'mahasiswa' ? '2px solid #3D3FA8' : '1.5px solid #CBD0E0',
            backgroundColor: value === 'mahasiswa' ? '#EEF0FF' : '#FFFFFF',
            color: value === 'mahasiswa' ? '#3D3FA8' : '#6B7280',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: value === 'mahasiswa' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Mahasiswa
        </button>
        <button
          type="button"
          onClick={() => onChange('hr')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: value === 'hr' ? '2px solid #3D3FA8' : '1.5px solid #CBD0E0',
            backgroundColor: value === 'hr' ? '#EEF0FF' : '#FFFFFF',
            color: value === 'hr' ? '#3D3FA8' : '#6B7280',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: value === 'hr' ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          HR Perusahaan
        </button>
      </div>
    </div>
  );
}

export default RoleSelector;