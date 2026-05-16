import React from 'react';
import { Download, FileText } from 'lucide-react';

export default function CVDocumentCard({ cvDocument }) {
  const handleDownload = () => {
    if (cvDocument?.url) {
      window.open(cvDocument.url, '_blank');
    } else {
      alert("URL CV tidak tersedia");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex items-center gap-4">
        {/* Ikon File */}
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
          <FileText size={24} />
        </div>
        
        {/* Detail File */}
        <div>
          <div className="font-semibold text-gray-900 text-sm">
            {cvDocument.name}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            Diunggah pada {new Date(cvDocument.uploadedDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} • {cvDocument.size}
          </div>
        </div>
      </div>

      {/* Tombol Download */}
      <button
        type="button"
        onClick={handleDownload}
        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
        aria-label="Download CV"
      >
        <Download size={20} />
      </button>
    </div>
  );
}