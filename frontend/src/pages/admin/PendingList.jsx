import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CheckCircle, ClipboardList, ChevronDown } from 'lucide-react';
import api from '@/api/axios';
import Navbar from '@/components/organisms/Navbar';
import PageFooter from '@/components/organisms/PageFooter';
import DashboardStatsRow from '@/components/organisms/DashboardStatsRow';
import DataTable from '@/components/organisms/DataTable';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';

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
  const [filterStatus, setFilterStatus] = useState('all');
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

  function onLogout() {
    navigate('/login');
  }

  const tableData = hrs
    .map((hr) => ({
      id: hr.hr_profile_id || hr.hr_id,
      name: hr.company_name || 'Tidak ada nama',
      industry: hr.position || '-',
      status: hr.status ? hr.status.toLowerCase() : 'pending',
      createdAt: hr.registered_at ? new Date(hr.registered_at).toLocaleDateString('id-ID') : (hr.verified_at ? new Date(hr.verified_at).toLocaleDateString('id-ID') : '-'),
    }))
    .filter((hr) => hr.name.toLowerCase().includes(search.toLowerCase()))
    .filter((hr) => filterStatus === 'all' || hr.status === filterStatus);

  const displayStats = [
    { label: 'TOTAL PERUSAHAAN', value: stats.total, icon: <Building2 size={22} /> },
    { label: 'TERVERIFIKASI', value: stats.verified, icon: <CheckCircle size={22} /> },
    { label: 'BELUM VERIFIKASI', value: stats.pending, icon: <ClipboardList size={22} /> },
  ];

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
      <Navbar variant="app" user={{ name: 'Admin IPB' }} onLogout={onLogout} />
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          padding: '32px 40px',
          maxWidth: '1200px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1A1A2E',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '24px',
          }}
        >
          Dashboard
        </h1>

        <DashboardStatsRow stats={displayStats} />

        <div style={{ marginTop: '24px' }}>
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder="Cari nama perusahaan..."
          />
        </div>

        {error && (
          <div
            style={{
              marginTop: '16px',
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
            marginTop: '24px',
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
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  backgroundColor: '#3D3FA8',
                  color: '#FFFFFF',
                  padding: '6px 32px 6px 14px',
                  fontSize: '13px',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '8px',
                  appearance: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="all">Filter: Semua</option>
                <option value="pending">Status: Belum Verifikasi</option>
                <option value="verified">Status: Terverifikasi</option>
                <option value="rejected">Status: Ditolak</option>
              </select>
              <div style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
              }}>
                <ChevronDown size={14} />
              </div>
            </div>
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
      <PageFooter />
    </div>
  );
};

export default PendingList;