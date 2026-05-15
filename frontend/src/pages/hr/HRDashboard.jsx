import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, List, Plus } from 'lucide-react';
import Navbar from '@/components/organisms/Navbar';
import PageFooter from '@/components/organisms/PageFooter';
import Sidebar from '@/components/organisms/Sidebar';
import SidebarLayout from '@/components/organisms/SidebarLayout';
import DataTable from '@/components/organisms/DataTable';
import SearchBar from '@/components/molecules/SearchBar';
import InternshipTableRow from '@/components/molecules/InternshipTableRow';
import Pagination from '@/components/molecules/Pagination';
import Button from '@/components/atoms/Button';

const MENU_HR = [
  { label: 'Kelola Lowongan', icon: Briefcase, href: '/hr/dashboard' },
  { label: 'Daftar Pelamar', icon: List, href: '/hr/pelamar' },
];

const DUMMY_INTERNSHIPS = [
  { id: 1, title: 'Data Analyst', location: 'Jakarta Utara', industry: 'Teknologi', quota: { filled: 3, total: 5 }, statusPelaksanaan: 'Hybrid', closingDate: '30 Apr 2026' },
  { id: 2, title: 'Frontend Developer', location: 'Bogor', industry: 'Software House', quota: { filled: 2, total: 2 }, statusPelaksanaan: 'WFO', closingDate: '28 Feb 2026' },
  { id: 3, title: 'Marketing Specialist', location: 'Bandung', industry: 'Manufaktur', quota: { filled: 0, total: 4 }, statusPelaksanaan: 'WFA', closingDate: '11 Apr 2026' },
  { id: 4, title: 'UI/UX Designer', location: 'Jakarta Selatan', industry: 'Teknologi', quota: { filled: 1, total: 3 }, statusPelaksanaan: 'Hybrid', closingDate: '15 Mei 2026' },
  { id: 5, title: 'Backend Engineer', location: 'Remote', industry: 'Software House', quota: { filled: 0, total: 2 }, statusPelaksanaan: 'WFA', closingDate: '20 Mei 2026' },
];

const COLUMNS = [
  { key: 'title', label: 'Judul Lowongan' },
  { key: 'location', label: 'Lokasi' },
  { key: 'industry', label: 'Industri' },
  { key: 'quota', label: 'Kuota' },
  { key: 'statusPelaksanaan', label: 'Status Pelaksanaan' },
  { key: 'closingDate', label: 'Tanggal Ditutup' },
  { key: 'action', label: 'Aksi', align: 'center' },
];

const ITEMS_PER_PAGE = 4;

function HRDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  function onLogout() {
    navigate('/login');
  }

  function onSearchChange(event) {
    setSearch(event.target.value);
    setCurrentPage(1);
  }

  const filtered = DUMMY_INTERNSHIPS.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.location && item.location.toLowerCase().includes(q)) ||
      (item.industry && item.industry.toLowerCase().includes(q)) ||
      (item.statusPelaksanaan && item.statusPelaksanaan.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div
      style={{
        minHeight: '100dvh',
        height: '100dvh',
        backgroundColor: '#EEF0F8',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar variant="app" user={{ name: 'HR Manager' }} onLogout={onLogout} />

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <SidebarLayout
          sidebar={<Sidebar menuItems={MENU_HR} activeHref="/hr/dashboard" />}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'Inter, sans-serif', margin: 0 }}>
              Kelola Lowongan
            </h1>
            <Button variant="primary" onClick={() => navigate('/hr/lowongan/baru')}>
              <Plus size={16} />
              Buat Lowongan Baru
            </Button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <SearchBar
              value={search}
              onChange={onSearchChange}
              placeholder="Deskripsi search"
            />
          </div>

          <DataTable
            columns={COLUMNS}
            data={paginated}
            emptyMessage="Tidak ada lowongan ditemukan"
            renderRow={(item) => (
              <InternshipTableRow
                key={item.id}
                title={item.title}
                location={item.location}
                industry={item.industry}
                quota={item.quota}
                statusPelaksanaan={item.statusPelaksanaan}
                closingDate={item.closingDate}
                onEdit={() => navigate(`/hr/lowongan/${item.id}/edit`)}
                onClose={() => console.log('tutup', item.id)}
                onDelete={() => console.log('hapus', item.id)}
              />
            )}
          />

          {totalPages > 1 && (
            <div style={{ marginTop: '16px', padding: '0 8px' }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </SidebarLayout>
      </div>

      <PageFooter />
    </div>
  );
}

export default HRDashboard;