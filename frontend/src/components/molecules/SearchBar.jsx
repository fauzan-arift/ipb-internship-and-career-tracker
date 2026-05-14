import React from 'react';
import { Search } from 'lucide-react';

function SearchBar({ value, onChange, placeholder = 'Cari...' }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', width: '100%' }}>
      <div
        style={{
          position: 'absolute',
          left: '12px',
          color: '#6B7280',
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <Search size={16} />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 12px 10px 38px',
          borderRadius: '8px',
          border: '1.5px solid #CBD0E0',
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif',
          color: '#1A1A2E',
          backgroundColor: '#FFFFFF',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

export default SearchBar;