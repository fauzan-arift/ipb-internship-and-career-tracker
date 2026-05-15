import React from 'react';

function PaginationInfo({ from, to, total, label = 'pelamar' }) {
  return (
    <span
      style={{
        fontSize: '13px',
        color: '#6B7280',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      Menampilkan {from}–{to} dari {total} {label}
    </span>
  );
}

export default PaginationInfo;