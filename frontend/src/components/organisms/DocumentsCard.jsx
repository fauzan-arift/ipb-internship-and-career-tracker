import React from 'react';
import { FileText } from 'lucide-react';
import InfoSectionCard from './InfoSectionCard';
import DocumentRow from '../molecules/DocumentRow';

function DocumentsCard({ documents = [] }) {
  return (
    <InfoSectionCard title="Dokumen" icon={<FileText size={18} />}>
      {documents.length === 0 ? (
        <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
          Tidak ada dokumen
        </p>
      ) : (
        <div>
          {documents.map((doc, index) => (
            <DocumentRow
              key={index}
              name={doc.name}
              format={doc.format}
              date={doc.date}
              href={doc.href}
            />
          ))}
        </div>
      )}
    </InfoSectionCard>
  );
}

export default DocumentsCard;