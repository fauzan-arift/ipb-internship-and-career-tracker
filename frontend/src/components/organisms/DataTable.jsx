import React from 'react';
import CompanyTableRow from '../molecules/CompanyTableRow';

function DataTable({ columns, data, onAction, emptyMessage = 'Tidak ada data' }) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #CBD0E0',
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#EEF0F8', borderBottom: '1px solid #CBD0E0' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: '40px 16px',
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#6B7280',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <CompanyTableRow
                key={item.id}
                company={item}
                onAction={onAction}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;