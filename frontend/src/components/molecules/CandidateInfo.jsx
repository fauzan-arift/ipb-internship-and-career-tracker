import { FileText } from 'lucide-react';

export default function CandidateInfo({ name, major, initials, photoUrl }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <FileText size={18} className="text-gray-700" />
        <h2 className="text-base font-bold text-gray-900">Informasi Kandidat</h2>
      </div>
      <div className="flex items-center gap-4">
        {photoUrl ? (
          <img 
            src={photoUrl} 
            alt={name} 
            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
            onError={(e) => {
              // Fallback to initials if image fails to load
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-lg font-bold text-base"
          style={{ display: photoUrl ? 'none' : 'flex' }}
        >
          {initials}
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">{major}</p>
        </div>
      </div>
    </div>
  );
}