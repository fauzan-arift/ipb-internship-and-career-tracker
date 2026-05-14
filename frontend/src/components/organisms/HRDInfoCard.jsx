import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { User } from 'lucide-react';
import InfoSectionCard from './InfoSectionCard';
import ContactRow from '../molecules/ContactRow';
import AvatarSquare from '../atoms/AvatarSquare';

function HRDInfoCard({ name, position, email, phone }) {
  return (
    <InfoSectionCard title="Informasi HRD" icon={<User size={18} />}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <AvatarSquare name={name || 'HR'} bg="#EEF0FF" color="#3D3FA8" size={44} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
            {name || '-'}
          </span>
          <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            {position || '-'}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <ContactRow icon={<Mail size={16} />} value={email} />
        <ContactRow icon={<Phone size={16} />} value={phone} />
      </div>
    </InfoSectionCard>
  );
}

export default HRDInfoCard;