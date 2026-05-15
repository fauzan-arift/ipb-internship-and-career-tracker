import React from 'react';
import AvatarSquare from '../atoms/AvatarSquare';
import Badge from '../atoms/Badge';

function CompanyTableRow({ company, onAction }) {
  function onMenuAction(action) {
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
      <td style={{ padding: '14px 16px' }}>
        <button
          type="button"
          onClick={() => onMenuAction('detail')}
          style={{
            backgroundColor: '#3D3FA8',
            border: 'none',
            cursor: 'pointer',
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: '600',
          }}
        >
          Lihat Detail
        </button>
      </td>
    </tr>
  );
}

export default CompanyTableRow;