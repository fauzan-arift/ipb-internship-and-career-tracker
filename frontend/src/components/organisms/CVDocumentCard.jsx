import React from 'react';
import { FileText } from 'lucide-react';
import InfoSectionCard from './InfoSectionCard';
import DocumentRow from '../molecules/DocumentRow';

function CVDocumentCard({ documents = [] }) {
  return (
    <InfoSectionCard title="Dokumen CV" icon={<FileText size={18} />}>
      {documents.length === 0 ? (
        <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
          Tidak ada dokumen
        </p>
      ) : (
        <div>
          {documents.map((doc, index) => (
            <DocumentRow
              key={index}
              name={doc.fileName}
              format={doc.fileSize}
              date={doc.uploadedAt}
              href={doc.href}
              onDownload={doc.onDownload}
            />
          ))}
        </div>
      )}
    </InfoSectionCard>
  );
}

export default CVDocumentCard;