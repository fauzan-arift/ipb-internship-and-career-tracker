import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, FileText, Bell, Map, BookOpen, User } from 'lucide-react';
import Navbar from '@/components/organisms/Navbar';
import PageFooter from '@/components/organisms/PageFooter';
import Sidebar from '@/components/organisms/Sidebar';
import SidebarLayout from '@/components/organisms/SidebarLayout';
import SearchBar from '@/components/molecules/SearchBar';
import InternshipCard from '@/components/molecules/InternshipCard';
import { useInternships } from '@/hooks/useInternships';
import { useAuth } from '@/hooks/useAuth';

const MENU_MAHASISWA = [
  { label: 'Lowongan Magang', icon: Briefcase, href: '/lowongan' },
  { label: 'Lamaran Saya', icon: FileText, href: '/lamaran-saya' },
  { label: 'Tawaran Lowongan', icon: Bell, href: '/tawaran' },
  { label: 'Career Mapping', icon: Map, href: '/career-mapping' },
  { label: 'Logbook', icon: BookOpen, href: '/logbook' },
  { label: 'Profil', icon: User, href: '/profil' },
];

function formatDateLabel(dateString) {
  if (!dateString) return 'TBD';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

function getCompanyInitial(name) {
  if (!name) return '??';
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getTagLabel(status) {
  if (!status) return null;
  const normalized = String(status).toUpperCase();
  if (normalized === 'PAID') return 'Paid Internship';
  if (normalized === 'UNPAID') return 'Unpaid Internship';
  return normalized;
}

function InternshipSearch() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { internships, searchQuery, setSearchQuery, isLoading, error } = useInternships();

  function onLogout() {
    logout();
    navigate('/login');
  }

  const mappedInternships = internships.map((item) => ({
    id: item.id,
    tags: [item.work_status || 'Unknown', getTagLabel(item.payment_status)].filter(Boolean),
    companyName: item.company?.company_name || 'Perusahaan Tidak Diketahui',
    companyInitial: getCompanyInitial(item.company?.company_name || item.title),
    position: item.title,
    location: item.location || 'Lokasi tidak tersedia',
    duration:
      item.start_date && item.end_date
        ? `${formatDateLabel(item.start_date)} - ${formatDateLabel(item.end_date)}`
        : 'Durasi tidak tersedia',
    deadline: formatDateLabel(item.close_date),
  }));

  return (
    <div
      style={{
        backgroundColor: '#EEF0F8',
        minHeight: '100dvh',
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar
        variant="app"
        user={user ? { name: user.email || user.userId || 'Mahasiswa' } : { name: 'Mahasiswa' }}
        onLogout={onLogout}
      />

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <SidebarLayout sidebar={<Sidebar menuItems={MENU_MAHASISWA} activeHref="/lowongan" />}>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1A1A2E',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '20px',
          }}
        >
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
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #CBD0E0',
              padding: '24px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Memuat lowongan magang...
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: '#FDECEA',
              border: '1px solid #F5C6C6',
              borderRadius: '12px',
              padding: '16px 20px',
              color: '#8B1A1A',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '24px',
            }}
          >
            {error}
          </div>
        )}

        {!isLoading && !error && mappedInternships.length === 0 && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #CBD0E0',
              padding: '24px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Tidak ada lowongan magang yang sesuai.
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '20px',
          }}
        >
          {mappedInternships.map((item) => (
            <InternshipCard
              key={item.id}
              tags={item.tags}
              companyName={item.companyName}
              companyInitial={item.companyInitial}
              position={item.position}
              location={item.location}
              duration={item.duration}
              deadline={item.deadline}
              onDetailClick={() => navigate(`/internship/${item.id}`)}
            />
          ))}
        </div>
        </SidebarLayout>
      </div>

      <PageFooter />
    </div>
  );
}

export default InternshipSearch;