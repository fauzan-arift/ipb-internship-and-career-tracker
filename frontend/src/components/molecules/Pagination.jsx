import React from 'react';
import PaginationButton from './PaginationButton';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
          color: currentPage === 1 ? '#CBD0E0' : '#3D3FA8',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          padding: '0 4px',
          fontWeight: '500',
        }}
      >
        Sebelumnya
      </button>

      {pages.map((page) => (
        <PaginationButton
          key={page}
          page={page}
          isActive={page === currentPage}
          onClick={() => onPageChange(page)}
        />
      ))}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
          color: currentPage === totalPages ? '#CBD0E0' : '#3D3FA8',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          padding: '0 4px',
          fontWeight: '500',
        }}
      >
        Selanjutnya
      </button>
    </div>
  );
}

export default Pagination;