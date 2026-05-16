import React from 'react';
import Badge from '../atoms/Badge';
import EditButton from '../atoms/EditButton';
import CloseButton from '../atoms/CloseButton';
import DeleteFileButton from '../atoms/DeleteFileButton';
import ReopenButton from '../atoms/ReopenButton';

function InternshipTableRow({ title, location, industry, quota, statusPelaksanaan, closingDate, status, onEdit, onClose, onDelete, onReopen }) {
  let statusVariant = 'gray';
  if (statusPelaksanaan === 'Hybrid') statusVariant = 'hybrid';
  if (statusPelaksanaan === 'WFO') statusVariant = 'wfo';
  if (statusPelaksanaan === 'WFA') statusVariant = 'wfa';

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
        >
          {title}
        </span>
      </td>
      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
        {location}
      </td>
      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
        {industry}
      </td>
      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
        {typeof quota === 'object' ? `${quota.filled}/${quota.total}` : `0/${quota}`}
      </td>
      <td style={{ padding: '14px 16px' }}>
        <Badge variant={status === 'closed' ? 'red' : 'green'}>{status === 'closed' ? 'Tertutup' : 'Terbuka'}</Badge>
      </td>
      <td style={{ padding: '14px 16px' }}>
        <Badge variant={statusVariant}>{statusPelaksanaan}</Badge>
      </td>
      <td style={{ padding: '14px 16px', fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
        {closingDate}
      </td>
      <td style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <EditButton onClick={onEdit} />
          {status === 'closed' ? (
            // show reopen button when closed
            <>
              <ReopenButton onClick={onReopen} />
            </>
          ) : (
            <CloseButton onClick={onClose} />
          )}
          <DeleteFileButton onClick={onDelete} />
        </div>
      </td>
    </tr>
  );
}

export default InternshipTableRow;