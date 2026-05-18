import React from 'react';
import { LogOut } from 'lucide-react';

function Navbar({ variant = 'app', user, onLogout }) {
  if (variant === 'auth') {
    return (
      <nav
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #CBD0E0',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <img src="/Logo IPB Internship Portal - internship.svg" alt="IPB Internship Portal" style={{ height: '32px', width: 'auto' }} />
      </nav>
    );
  }

  return (
    <nav
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #CBD0E0',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <img src="/Logo IPB Internship Portal - internship.svg" alt="IPB Internship Portal" style={{ height: '32px', width: 'auto' }} />
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            {user.name}
          </span>
          <button
            type="button"
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6B7280',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              padding: '0',
            }}
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;