import React from 'react';

export default function ApplicantSummaryCard({ candidate }) {
  const initials = (candidate.name || '')
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      style={{
        borderRadius: '24px',
        border: '1px solid #E5E7EB',
        backgroundColor: '#FFFFFF',
        padding: '24px',
        maxWidth: '420px',
        width: '100%',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            backgroundColor: '#EEF2FF',
            color: '#4338CA',
            display: 'grid',
            placeItems: 'center',
            fontSize: '22px',
            fontWeight: '700',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {initials}
        </div>
        <div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827', fontFamily: 'Inter, sans-serif' }}>
            {candidate.name}
          </div>
          <div style={{ marginTop: '4px', color: '#4B5563', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
            {candidate.major}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '8px', color: '#374151', fontSize: '14px', lineHeight: '1.7' }}>
        <div style={{ marginBottom: '12px' }}>
          <strong style={{ color: '#111827' }}>Institusi</strong>
          <div>{candidate.university}</div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <strong style={{ color: '#111827' }}>Posisi yang dilamar</strong>
          <div>{candidate.appliedPosition}</div>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span
            style={{
              backgroundColor: '#EEF2FF',
              color: '#4338CA',
              borderRadius: '999px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: '600',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Ongoing
          </span>
          <span
            style={{
              backgroundColor: '#ECFDF5',
              color: '#166534',
              borderRadius: '999px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: '600',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Kandidat Terpilih
          </span>
        </div>
      </div>
    </div>
  );
}
