import React from 'react';
import { LogOut } from 'lucide-react';
import logoIPB from '@/assets/logo-ipb.png';

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
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logoIPB} alt="IPB Logo" style={{ height: '28px', width: 'auto' }} />
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#3D3FA8', fontFamily: 'Inter, sans-serif' }}>
            IPB Internship Portal
          </span>
        </div>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img src={logoIPB} alt="IPB Logo" style={{ height: '28px', width: 'auto' }} />
        <span style={{ fontSize: '18px', fontWeight: '700', color: '#3D3FA8', fontFamily: 'Inter, sans-serif' }}>
          IPB Internship Portal
        </span>
      </div>
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