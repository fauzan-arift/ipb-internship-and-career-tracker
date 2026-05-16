import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function OfferBreadcrumb({ applicantId }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500">
      <Link to="/hr/applicants" className="hover:text-indigo-600 transition-colors">
        Daftar Pelamar
      </Link>
      <ChevronRight size={16} className="text-gray-400" />
      <Link to={`/hr/applicants/${applicantId}`} className="hover:text-indigo-600 transition-colors">
        Detail Pelamar
      </Link>
      <ChevronRight size={16} className="text-gray-400" />
      <span className="text-gray-900 font-medium">Berikan Penawaran Magang</span>
    </nav>
  );
}