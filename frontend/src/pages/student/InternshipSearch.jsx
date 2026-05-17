import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/molecules/SearchBar';
import InternshipCard from '@/components/molecules/InternshipCard';
import { useInternships } from '@/hooks/useInternships';

function formatDateLabel(dateString) {
  if (!dateString) return 'TBD';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short',
  });
}

function getCompanyInitial(name) {
  if (!name) return '??';
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

function getTagLabel(status) {
  if (!status) return null;
  const n = String(status).toUpperCase();
  if (n === 'PAID') return 'Paid Internship';
  if (n === 'UNPAID') return 'Unpaid Internship';
  return n;
}

function InternshipSearch() {
  const navigate = useNavigate();
  const { internships, searchQuery, setSearchQuery, isLoading, error } = useInternships();

  const mappedInternships = internships.map((item) => ({
    id: item.id,
    tags: [item.work_status, getTagLabel(item.payment_status)].filter(Boolean),
    companyName: item.company?.company_name || 'Perusahaan Tidak Diketahui',
    companyInitial: getCompanyInitial(item.company?.company_name || item.title),
    companyLogoUrl: item.company?.photo_profile_url,
    position: item.title,
    location: item.location || 'Lokasi tidak tersedia',
    duration: item.start_date && item.end_date
      ? `${formatDateLabel(item.start_date)} - ${formatDateLabel(item.end_date)}`
      : 'Durasi tidak tersedia',
    deadline: formatDateLabel(item.close_date),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900">
        Cari Lowongan Magang
      </h1>

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari judul, perusahaan, atau lokasi"
        />
      </div>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-600 shadow-sm">
          Memuat lowongan magang...
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 mb-6">
          {error}
        </div>
      )}

      {!isLoading && !error && mappedInternships.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500 shadow-sm">
          Tidak ada lowongan magang yang sesuai.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mappedInternships.map((item) => (
          <InternshipCard
            key={item.id}
            tags={item.tags}
            companyName={item.companyName}
            companyInitial={item.companyInitial}
            companyLogoUrl={item.companyLogoUrl}
            position={item.position}
            location={item.location}
            duration={item.duration}
            deadline={item.deadline}
            onDetailClick={() => navigate(`/internship/${item.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

export default InternshipSearch;
