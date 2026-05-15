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
import useHRs from '@/hooks/useHRs';

const MENU_HR = [
  { label: 'Kelola Lowongan', icon: Briefcase, href: '/hr/dashboard' },
  { label: 'Daftar Pelamar', icon: List, href: '/hr/pelamar' },
];

// data now loaded from API via useHRs

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

  const { items, isLoading, error, total, page, setPage, setSearchQuery } = useHRs({ initialSearch: '', initialPage: 1, initialLimit: ITEMS_PER_PAGE });

  function onLogout() {
    navigate('/login');
  }

  function onSearchChange(event) {
    const q = event.target.value;
    setSearch(q);
    setPage(1);
    setSearchQuery(q);
  }
  // map hook results to table data
  const paginated = items || [];
  const totalPages = Math.ceil((total || 0) / ITEMS_PER_PAGE);

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
            <Button variant="primary" onClick={() => navigate('/hr/dashboard/baru')}>
              <Plus size={16} />
              Buat Lowongan Baru
            </Button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <SearchBar
              value={search}
              onChange={(e) => {
                onSearchChange(e);
                // set hook searchQuery by calling setSearchQuery from hook
              }}
              placeholder="Cari judul, lokasi, industri, atau status"
            />
          </div>

          <DataTable
            columns={COLUMNS}
            data={paginated}
            emptyMessage={isLoading ? 'Memuat...' : 'Tidak ada lowongan ditemukan'}
            renderRow={(item) => (
              <InternshipTableRow
                key={item.id}
                id={item.id}
                title={item.title}
                location={item.location}
                industry={item.industry}
                quota={item.quota}
                statusPelaksanaan={item.statusPelaksanaan}
                closingDate={item.closing_date || item.closingDate}
                onEdit={() => navigate(`/hr/lowongan/${item.id}/edit`)}
                onClose={() => console.log('tutup', item.id)}
                onDelete={() => console.log('hapus', item.id)}
              />
            )}
          />

          {totalPages > 1 && (
            <div style={{ marginTop: '16px', padding: '0 8px' }}>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
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