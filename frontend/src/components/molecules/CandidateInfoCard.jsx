import React from 'react';
import { GraduationCap } from 'lucide-react';
import AvatarSquare from '../atoms/AvatarSquare';

function CandidateInfoCard({ name, major, faculty, logoInitials, logoColor = '#3D3FA8' }) {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #CBD0E0',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <AvatarSquare
        name={logoInitials || name}
        bg={logoColor}
        color="#FFFFFF"
        size={44}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#1A1A2E',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {name}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <GraduationCap size={14} color="#6B7280" />
          <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            {major} • {faculty}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CandidateInfoCard;