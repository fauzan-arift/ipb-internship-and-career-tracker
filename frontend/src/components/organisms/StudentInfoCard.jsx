import React from 'react';
import { User } from 'lucide-react';
import InfoSectionCard from './InfoSectionCard';
import InfoGrid from './InfoGrid';
import SkillList from '../molecules/SkillList';

function StudentInfoCard({ student = {} }) {
  const fields = [
    { label: 'Nama Lengkap', value: student.namaLengkap },
    { label: 'NIM', value: student.nim },
    { label: 'Program Studi', value: student.programStudi },
    { label: 'Fakultas', value: student.fakultas },
    { label: 'IPK', value: student.ipk },
    { label: 'No. Telp', value: student.noTelp },
    { label: 'Email', value: student.email },
  ];

  return (
    <InfoSectionCard title="Informasi Mahasiswa" icon={<User size={18} />}>
      <InfoGrid fields={fields} />
      {student.skills && student.skills.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
            Skills
          </span>
          <SkillList skills={student.skills} />
        </div>
      )}
    </InfoSectionCard>
  );
}

export default StudentInfoCard;