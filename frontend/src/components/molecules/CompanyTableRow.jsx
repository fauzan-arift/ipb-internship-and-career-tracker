import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import AvatarSquare from '../atoms/AvatarSquare';
import Badge from '../atoms/Badge';

function CompanyTableRow({ company, onAction }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function onMenuToggle() {
    setMenuOpen(!menuOpen);
  }

  function onMenuAction(action) {
    setMenuOpen(false);
    if (onAction) onAction(action, company);
  }

  let badgeVariant = 'gray';
  if (company.status === 'verified') badgeVariant = 'green';
  if (company.status === 'pending') badgeVariant = 'yellow';
  if (company.status === 'rejected') badgeVariant = 'red';

  return (
    <tr style={{ borderBottom: '1px solid #CBD0E0' }}>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AvatarSquare name={company.name} bg="#EEF0FF" color="#3D3FA8" size={36} />
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
            {company.name}
          </span>
        </div>
      </td>
      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
        {company.industry}
      </td>
      <td style={{ padding: '14px 16px' }}>
        <Badge variant={badgeVariant}>
          {company.status === 'verified' && 'Terverifikasi'}
          {company.status === 'pending' && 'Menunggu'}
          {company.status === 'rejected' && 'Ditolak'}
          {company.status !== 'verified' && company.status !== 'pending' && company.status !== 'rejected' && company.status}
        </Badge>
      </td>
      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
        {company.createdAt}
      </td>
      <td style={{ padding: '14px 16px', position: 'relative' }}>
        <button
          type="button"
          onClick={onMenuToggle}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6B7280',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            borderRadius: '4px',
          }}
        >
          <MoreVertical size={16} />
        </button>
        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              right: '16px',
              top: '100%',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD0E0',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              zIndex: 10,
              minWidth: '140px',
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              onClick={() => onMenuAction('detail')}
              style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', background: 'none', border: 'none', fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#1A1A2E', cursor: 'pointer' }}
            >
              Lihat Detail
            </button>
            <button
              type="button"
              onClick={() => onMenuAction('verify')}
              style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', background: 'none', border: 'none', fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#1A6B3A', cursor: 'pointer' }}
            >
              Verifikasi
            </button>
            <button
              type="button"
              onClick={() => onMenuAction('reject')}
              style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', background: 'none', border: 'none', fontSize: '13px', fontFamily: 'Inter, sans-serif', color: '#8B1A1A', cursor: 'pointer' }}
            >
              Tolak
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default CompanyTableRow;