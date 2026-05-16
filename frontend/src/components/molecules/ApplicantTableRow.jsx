import React from 'react';
import Badge from '../atoms/Badge';
import ChevronRightButton from '../atoms/ChevronRightButton';

function ApplicantTableRow({ name, major, internshipTitle, appliedDate, status, onClick }) {
  let badgeVariant = 'gray';
  if (status === 'Diterima') badgeVariant = 'green';
  if (status === 'Diproses') badgeVariant = 'diproses';
  if (status === 'Ditolak') badgeVariant = 'red';
  if (status === 'Melamar Posisi') badgeVariant = 'pipeline';

  return (
    <tr style={{ borderBottom: '1px solid #CBD0E0' }}>
      <td style={{ padding: '14px 16px' }}>
        <span
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#3D3FA8',
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
          }}
          onClick={onClick}
        >
          {name}
        </span>
      </td>
      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
        {major}
      </td>
      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
        {internshipTitle || '-'}
      </td>
      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
        {appliedDate}
      </td>
      <td style={{ padding: '14px 16px' }}>
        <Badge variant={badgeVariant}>{status}</Badge>
      </td>
      <td style={{ padding: '14px 16px' }}>
        <ChevronRightButton onClick={onClick} />
      </td>
    </tr>
  );
}

export default ApplicantTableRow;