import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PaginationButton from './PaginationButton';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
          color: currentPage === 1 ? '#CBD0E0' : '#3D3FA8',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          fontWeight: '500',
          padding: '0',
        }}
      >
        <ChevronLeft size={16} />
        Sebelumnya
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {pages.map((page) => (
          <PaginationButton
            key={page}
            page={page}
            isActive={page === currentPage}
            onClick={() => onPageChange(page)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
          color: currentPage === totalPages ? '#CBD0E0' : '#3D3FA8',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          fontWeight: '500',
          padding: '0',
        }}
      >
        Selanjutnya
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default Pagination;