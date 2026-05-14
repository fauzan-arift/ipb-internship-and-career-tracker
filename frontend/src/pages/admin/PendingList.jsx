import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CheckCircle, ClipboardList } from 'lucide-react';
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

const STATS = [
  { label: 'TOTAL PERUSAHAAN', value: 150, icon: <Building2 size={22} /> },
  { label: 'TERVERIFIKASI', value: 120, icon: <CheckCircle size={22} /> },
  { label: 'BELUM VERIFIKASI', value: 30, icon: <ClipboardList size={22} /> },
];

const PendingList = () => {
  const [hrs, setHrs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await api.get('/admin/pending-registrations');
        if (res.data.success) {
          setHrs(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.detail || 'Gagal memuat data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPending();
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
    .filter((hr) =>
      hr.company_name.toLowerCase().includes(search.toLowerCase())
    )
    .map((hr) => ({
      id: hr.hr_profile_id || hr.hr_id,
      name: hr.company_name,
      industry: hr.position || '-',
      status: 'pending',
      createdAt: new Date(hr.registered_at).toLocaleDateString('id-ID'),
    }));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#EEF0F8', display: 'flex', flexDirection: 'column' }}>
      <Navbar variant="app" user={{ name: 'Admin IPB' }} onLogout={onLogout} />
      <div
        style={{
          flex: 1,
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

        <DashboardStatsRow stats={STATS} />

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
            <Button variant="primary" size="sm" onClick={() => alert('Coming soon')}>
              Filter
            </Button>
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