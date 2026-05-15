import React from 'react';
import { FileText, Download } from 'lucide-react';

function DocumentLink({ fileName, fileUrl }) {
  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 hover:underline text-sm font-medium"
    >
      <FileText size={16} />
      <span>{fileName}</span>
      <Download size={14} className="text-gray-400" />
    </a>
  );
}

export default DocumentLink;