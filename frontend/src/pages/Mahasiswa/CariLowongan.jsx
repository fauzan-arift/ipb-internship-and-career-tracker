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
  if (n === 'PAID')   return 'Paid Internship';
  if (n === 'UNPAID') return 'Unpaid Internship';
  return n;
}

export default function CariLowongan() {
  const navigate = useNavigate();
  const { internships, searchQuery, setSearchQuery, isLoading, error } = useInternships();

  const mappedInternships = internships.map((item) => ({
    id:             item.id,
    tags:           [item.work_status, getTagLabel(item.payment_status)].filter(Boolean),
    companyName:    item.company?.company_name || 'Perusahaan Tidak Diketahui',
    companyInitial: getCompanyInitial(item.company?.company_name || item.title),
    position:       item.title,
    location:       item.location || 'Lokasi tidak tersedia',
    duration:       item.start_date && item.end_date
                      ? `${formatDateLabel(item.start_date)} - ${formatDateLabel(item.end_date)}`
                      : 'Durasi tidak tersedia',
    deadline:       formatDateLabel(item.close_date),
  }));

  return (
    // ✅ Just content — no sidebar, no h-screen, no overflow-y-auto
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '16px', color: '#111827' }}>
        Cari Lowongan Magang
      </h1>

      <div style={{ marginBottom: '24px' }}>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari judul, perusahaan, atau lokasi"
        />
      </div>

      {isLoading && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px', textAlign: 'center', color: '#6B7280' }}>
          Memuat lowongan magang...
        </div>
      )}

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {!isLoading && !error && mappedInternships.length === 0 && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px', textAlign: 'center', color: '#6B7280' }}>
          Tidak ada lowongan magang yang sesuai.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
        {mappedInternships.map((item) => (
          <InternshipCard
            key={item.id}
            {...item}
            onDetailClick={() => navigate(`/lowongan/${item.id}`)}
          />
        ))}
      </div>
    </div>
  );
}