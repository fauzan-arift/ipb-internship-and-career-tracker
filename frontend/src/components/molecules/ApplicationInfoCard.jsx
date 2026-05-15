import React from 'react';
import Badge from '../atoms/Badge';
import TimelineItem from './TimelineItem';

function ApplicationInfoCard({ position, appliedDate, currentStatus, timeline = [] }) {
  let badgeVariant = 'gray';
  if (currentStatus === 'Diterima') badgeVariant = 'green';
  if (currentStatus === 'Diproses') badgeVariant = 'diproses';
  if (currentStatus === 'Ditolak') badgeVariant = 'red';
  if (currentStatus === 'Melamar Posisi') badgeVariant = 'pipeline';

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #CBD0E0',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Posisi Dilamar
        </span>
        <span style={{ fontSize: '15px', fontWeight: '600', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
          {position}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Tanggal Melamar
        </span>
        <span style={{ fontSize: '14px', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
          {appliedDate}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Status Saat Ini
        </span>
        <Badge variant={badgeVariant}>{currentStatus}</Badge>
      </div>

      {timeline.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #CBD0E0', paddingTop: '16px' }}>
          {timeline.map((item, index) => (
            <TimelineItem
              key={index}
              label={item.label}
              description={item.date}
              active={item.isDone}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ApplicationInfoCard;