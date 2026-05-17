import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import DataTable from '@/components/organisms/DataTable';
import ApplicantTableRow from '@/components/molecules/ApplicantTableRow';
import Pagination from '@/components/molecules/Pagination';
import PaginationInfo from '@/components/molecules/PaginationInfo';
import SingleStatCard from '@/components/molecules/SingleStatCard';
import SearchBar from '@/components/molecules/SearchBar';
import useApplicants from '@/hooks/useApplicants';

const COLUMNS = [
  { key: 'name', label: 'Nama Mahasiswa' },
  { key: 'major', label: 'Jurusan' },
  { key: 'internshipTitle', label: 'Posisi' },
  { key: 'appliedDate', label: 'Tanggal Melamar' },
  { key: 'status', label: 'Status' },
  { key: 'action', label: 'Aksi', align: 'center' },
];

function ApplicantList() {
  const navigate = useNavigate();
  const { 
    items, total, totalPages, page, from, to, setPage, loading, error,
    searchQuery, setSearchQuery, statusFilter, setStatusFilter 
  } = useApplicants();

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'Inter, sans-serif', marginBottom: '24px' }}>
        Daftar Pelamar
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <SingleStatCard label="Total Pelamar" value={total} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama mahasiswa, jurusan, atau posisi..."
        />
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <PaginationInfo from={from} to={to} total={total} label="pelamar" />
          
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
              <option value="">Filter: Semua Status</option>
              <option value="Pending">Status: Pending</option>
              <option value="Diproses">Status: Diproses</option>
              <option value="Review HR">Status: Review HR</option>
              <option value="Interview">Status: Interview</option>
              <option value="Ditawarkan">Status: Ditawarkan</option>
              <option value="Diterima">Status: Diterima</option>
              <option value="Ditolak">Status: Ditolak</option>
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

        {error ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#E53E3E' }}>
            <p>{error}</p>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#6B7280' }}>
            <p>Memuat data pelamar...</p>
          </div>
        ) : (
          <DataTable
            columns={COLUMNS}
            data={items}
            emptyMessage="Tidak ada pelamar ditemukan"
            renderRow={(item) => (
              <ApplicantTableRow
                key={item.id}
                name={item.name}
                major={item.major}
                internshipTitle={item.internshipTitle}
                appliedDate={item.appliedDate}
                status={item.status}
                onClick={() => navigate(`/hr/applicants/${item.id}`)}
              />
            )}
          />
        )}

        {totalPages > 1 && (
          <div style={{ marginTop: '16px' }}>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicantList;