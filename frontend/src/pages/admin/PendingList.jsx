import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CheckCircle, ClipboardList, ChevronDown } from 'lucide-react';
import api from '@/api/axios';
import DashboardStatsRow from '@/components/organisms/DashboardStatsRow';
import DataTable from '@/components/organisms/DataTable';
import SearchBar from '@/components/molecules/SearchBar';
import FilterButton from '@/components/molecules/FilterButton';

const COLUMNS = [
  { key: 'name', label: 'Nama Perusahaan' },
  { key: 'industry', label: 'Industri' },
  { key: 'status', label: 'Status Verifikasi' },
  { key: 'createdAt', label: 'Tanggal Registrasi' },
  { key: 'action', label: 'Aksi' },
];


const PendingList = () => {
  const [hrs, setHrs] = useState([]);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendingRes, historyRes] = await Promise.all([
          api.get('/admin/pending-registrations'),
          api.get('/admin/hr/history')
        ]);
        
        const pendingData = pendingRes.data.success ? pendingRes.data.data : [];
        const historyData = historyRes.data.success ? historyRes.data.data : [];
        
        // Combine all data for the table
        setHrs([...pendingData, ...historyData]);
        
        const pendingCount = pendingData.length;
        const verifiedCount = historyData.filter(hr => hr.status === 'VERIFIED').length;
        const totalCount = pendingCount + historyData.length;
        
        setStats({
          total: totalCount,
          verified: verifiedCount,
          pending: pendingCount
        });

      } catch (err) {
        setError(err.response?.data?.detail || 'Gagal memuat data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  function onSearchChange(event) {
    setSearch(event.target.value);
  }

  function onActionHandler(action, company) {
    if (action === 'detail') {
      navigate(`/admin/hr/profile/${company.id}`);
    }
  }

  const tableData = hrs
    .map((hr) => ({
      id: hr.hr_profile_id || hr.hr_id,
      name: hr.company_name || 'Tidak ada nama',
      industry: hr.industry || '-',
      status: hr.status ? hr.status.toLowerCase() : 'pending',
      createdAt: hr.registered_at ? new Date(hr.registered_at).toLocaleDateString('id-ID') : (hr.verified_at ? new Date(hr.verified_at).toLocaleDateString('id-ID') : '-'),
    }))
    .filter((hr) => hr.name.toLowerCase().includes(search.toLowerCase()))
    .filter((hr) => !filterStatus || filterStatus === 'all' || hr.status === filterStatus);

  const displayStats = [
    { label: 'TOTAL PERUSAHAAN', value: stats.total, icon: <Building2 size={22} /> },
    { label: 'TERVERIFIKASI', value: stats.verified, icon: <CheckCircle size={22} /> },
    { label: 'BELUM VERIFIKASI', value: stats.pending, icon: <ClipboardList size={22} /> },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1
        style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1A1A2E',
          fontFamily: 'Inter, sans-serif',
          margin: 0,
        }}
      >
        Dashboard
      </h1>

      <DashboardStatsRow stats={displayStats} />

      <div>
        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Cari nama perusahaan..."
        />
      </div>

      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#FDECEA',
            color: '#8B1A1A',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #CBD0E0',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #CBD0E0',
          }}
        >
          <span
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1A1A2E',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Daftar Perusahaan Terbaru
          </span>
          <FilterButton
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            defaultLabel="Semua"
            options={[
              { value: 'pending', label: 'Belum Verifikasi' },
              { value: 'verified', label: 'Terverifikasi' },
              { value: 'rejected', label: 'Ditolak' },
            ]}
          />
        </div>

        {isLoading ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Memuat data...
          </div>
        ) : (
          <DataTable
            columns={COLUMNS}
            data={tableData}
            onAction={onActionHandler}
            emptyMessage="Tidak ada perusahaan ditemukan"
          />
        )}
      </div>
    </div>
  );
};

export default PendingList;