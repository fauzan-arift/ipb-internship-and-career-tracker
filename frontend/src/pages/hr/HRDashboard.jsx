import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, List, Plus } from 'lucide-react';
import DataTable from '@/components/organisms/DataTable';
import SearchBar from '@/components/molecules/SearchBar';
import InternshipTableRow from '@/components/molecules/InternshipTableRow';
import Pagination from '@/components/molecules/Pagination';
import Button from '@/components/atoms/Button';
import ConfirmationDialog from '@/components/organisms/ConfirmationDialog';
import useHRs from '@/hooks/useHRs';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState({ id: null, action: null });

  const { items, isLoading, error, total, page, setPage, setSearchQuery } = useHRs({
    initialSearch: '', initialPage: 1, initialLimit: ITEMS_PER_PAGE
  });

  function onSearchChange(event) {
    const q = event.target.value;
    setSearch(q);
    setPage(1);
    setSearchQuery(q);
  }

  function handleAction(id, action) {
    setPendingAction({ id, action });
    setDialogOpen(true);
  }

  function confirmAction() {
    const { id, action } = pendingAction;
    if (action === 'close') {
      console.log('tutup', id); // ganti dengan API call nanti
    } else if (action === 'delete') {
      console.log('hapus', id); // ganti dengan API call nanti
    }
    setDialogOpen(false);
    setPendingAction({ id: null, action: null });
  }

  const paginated = items || [];
  const totalPages = Math.ceil((total || 0) / ITEMS_PER_PAGE);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'Inter, sans-serif', margin: 0 }}>
          Kelola Lowongan
        </h1>
        <Button variant="primary" onClick={() => navigate('/hr/dashboard/new')}>
          <Plus size={16} />
          Buat Lowongan Baru
        </Button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <SearchBar
          value={search}
          onChange={onSearchChange}
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
            statusPelaksanaan={item.work_status || item.statusPelaksanaan}
            closingDate={item.close_date || item.closingDate}
            onEdit={() => navigate(`/hr/dashboard/${item.id}/edit`)}
            onClose={() => handleAction(item.id, 'close')}
            onDelete={() => handleAction(item.id, 'delete')}
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

      <ConfirmationDialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setPendingAction({ id: null, action: null });
        }}
        onConfirm={confirmAction}
        title={pendingAction.action === 'close' ? 'Tutup Lowongan' : 'Hapus Lowongan'}
        message={
          pendingAction.action === 'close'
            ? 'Apakah Anda yakin ingin menutup lowongan ini? Lowongan tidak akan bisa dilamar lagi.'
            : 'Apakah Anda yakin ingin menghapus lowongan ini? Tindakan ini tidak bisa dibatalkan.'
        }
      />
    </div>
  );
}

export default HRDashboard;