import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, List, Plus } from 'lucide-react';
import DataTable from '@/components/organisms/DataTable';
import SearchBar from '@/components/molecules/SearchBar';
import InternshipTableRow from '@/components/molecules/InternshipTableRow';
import Pagination from '@/components/molecules/Pagination';
import Button from '@/components/atoms/Button';
import ConfirmationDialog from '@/components/organisms/ConfirmationDialog';
import DatePicker from '@/components/atoms/DatePicker';
import useHRs from '@/hooks/useHRs';
import hrService from '@/services/hrService';

const COLUMNS = [
  { key: 'title', label: 'Judul Lowongan' },
  { key: 'location', label: 'Lokasi' },
  { key: 'industry', label: 'Industri' },
  { key: 'quota', label: 'Kuota' },
  { key: 'status', label: 'Status' },
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
  const [reopenDate, setReopenDate] = useState(null);
  const [reopenError, setReopenError] = useState('');
  const [pendingStartDate, setPendingStartDate] = useState(null);

  const { items, isLoading, error, total, page, setPage, setSearchQuery, refresh } = useHRs({
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
    if (action === 'reopen') {
      const item = items.find(i => i.id === id);
      const startDate = item?.start_date || item?.startDate;
      setPendingStartDate(startDate);

      // Default to 1 week from now, but capped by start_date
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      
      const sd = startDate ? new Date(startDate) : null;
      if (sd && defaultDate > sd) {
        setReopenDate(sd);
      } else {
        setReopenDate(defaultDate);
      }
    }
    setDialogOpen(true);
  }


  React.useEffect(() => {
    if (pendingAction.action === 'reopen' && reopenDate && pendingStartDate) {
      const d = new Date(reopenDate.toISOString().split('T')[0]);
      const s = new Date(pendingStartDate);
      if (d > s) {
        setReopenError(`Tanggal penutupan tidak boleh melebihi tanggal mulai (${pendingStartDate})`);
      } else {
        setReopenError('');
      }
    } else {
      setReopenError('');
    }
  }, [reopenDate, pendingStartDate, pendingAction.action]);

  function confirmAction() {
    const { id, action } = pendingAction;
    console.debug('Confirm action:', action, 'id:', id);
     if (action === 'close') {
      hrService.closeInternship(id).then(() => refresh()).catch((e) => console.error(e));
    } else if (action === 'delete') {
      hrService.deleteInternship(id).then(() => refresh()).catch((e) => console.error(e));
    } else if (action === 'reopen') {
      const payload = {
        close_date: reopenDate ? reopenDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      };
      hrService.reopenInternship(id, payload).then(() => refresh()).catch((e) => console.error(e));
    }
    setDialogOpen(false);
    setPendingAction({ id: null, action: null });
    setReopenDate(null);
    setReopenError('');
    setPendingStartDate(null);
  }

  const paginated = items || [];
  const totalPages = Math.ceil((total || 0) / ITEMS_PER_PAGE);

  return (
    <div className="p-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="m-0" style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
          Kelola Lowongan
        </h1>
        <Button variant="primary" onClick={() => navigate('/hr/dashboard/new')}>
          <Plus size={16} />
          Buat Lowongan Baru
        </Button>
      </div>

      <div className="mb-6">
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
            quota={{ filled: item.filled_quota || 0, total: item.quota }}
                    status={
                      (function detectStatus(it) {
                        if (it == null) return 'open';
                        if (typeof it.is_closed === 'boolean') return it.is_closed ? 'closed' : 'open';
                        if (typeof it.closed === 'boolean') return it.closed ? 'closed' : 'open';
                        const s = (it.status || it.state || '').toString().toLowerCase();
                        if (s.includes('close') || s.includes('closed')) return 'closed';
                        if (s.includes('open') || s.includes('active')) return 'open';
                        return it.is_active === false ? 'closed' : 'open';
                      })(item)
                    }
            statusPelaksanaan={item.work_status || item.statusPelaksanaan}
            closingDate={item.close_date || item.closingDate}
            onEdit={() => navigate(`/hr/dashboard/${item.id}/edit`)}
            onClose={() => handleAction(item.id, 'close')}
            onDelete={() => handleAction(item.id, 'delete')}
            onReopen={() => handleAction(item.id, 'reopen')}
          />
        )}
      />

      {totalPages > 1 && (
        <div className="mt-4 px-2">
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
          setReopenDate(null);
          setReopenError('');
          setPendingStartDate(null);
        }}
        onConfirm={confirmAction}
        isConfirmDisabled={!!reopenError}
        title={
          pendingAction.action === 'close' ? 'Tutup Lowongan' : (pendingAction.action === 'reopen' ? 'Buka Kembali Lowongan' : 'Hapus Lowongan')
        }
        message={
          pendingAction.action === 'close'
            ? 'Apakah Anda yakin ingin menutup lowongan ini? Lowongan tidak akan bisa dilamar lagi.'
            : (pendingAction.action === 'reopen'
                ? 'Pilih tanggal penutupan baru untuk lowongan ini agar mahasiswa dapat melamar kembali.'
                : 'Apakah Anda yakin ingin menghapus lowongan ini? Tindakan ini tidak bisa dibatalkan.')
        }
      >
        {pendingAction.action === 'reopen' && (
          <div className="mt-4">
            <DatePicker
              label="Tanggal Penutupan Baru"
              value={reopenDate}
              onChange={setReopenDate}
              placeholder="Pilih tanggal"
              error={reopenError}
            />
          </div>
        )}
      </ConfirmationDialog>
    </div>
  );
}

export default HRDashboard;