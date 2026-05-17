import React from 'react';
import { FileText } from 'lucide-react';
import InfoSectionCard from './InfoSectionCard';
import FileViewRow from '../molecules/FileViewRow';

function DocumentsCard({ documents = [] }) {
  return (
    <InfoSectionCard title="Dokumen" icon={<FileText size={18} />}>
      {documents.length === 0 ? (
        <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
          Tidak ada dokumen
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {documents.map((doc, index) => (
            <FileViewRow
              key={index}
              fileName={doc.name}
              fileSize={doc.format}
              uploadedAt={doc.date}
              href={doc.href}
            />
          ))}
        </div>
      )}
    </InfoSectionCard>
  );
}

export default DocumentsCard;