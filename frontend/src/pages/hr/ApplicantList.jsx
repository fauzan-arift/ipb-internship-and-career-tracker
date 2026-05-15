import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/organisms/DataTable';
import ApplicantTableRow from '@/components/molecules/ApplicantTableRow';
import Pagination from '@/components/molecules/Pagination';
import PaginationInfo from '@/components/molecules/PaginationInfo';
import SingleStatCard from '@/components/molecules/SingleStatCard';
import useApplicants from '@/hooks/useApplicants';

const COLUMNS = [
  { key: 'name', label: 'Nama Mahasiswa' },
  { key: 'major', label: 'Jurusan' },
  { key: 'appliedDate', label: 'Tanggal Melamar' },
  { key: 'status', label: 'Status' },
  { key: 'action', label: 'Aksi', align: 'center' },
];

function ApplicantList() {
  const navigate = useNavigate();
  const { items, total, totalPages, page, from, to, setPage } = useApplicants();

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'Inter, sans-serif', marginBottom: '24px' }}>
        Daftar Pelamar
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <SingleStatCard label="Total Pelamar" value={total} />
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <PaginationInfo from={from} to={to} total={total} label="pelamar" />
          <button
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: '#3D3FA8', color: '#fff', border: 'none',
              borderRadius: '8px', padding: '8px 16px', fontSize: '14px',
              fontWeight: '500', cursor: 'pointer',
            }}
          >
            Filter ▾
          </button>
        </div>

        <DataTable
          columns={COLUMNS}
          data={items}
          emptyMessage="Tidak ada pelamar ditemukan"
          renderRow={(item) => (
            <ApplicantTableRow
              key={item.id}
              name={item.name}
              major={item.major}
              appliedDate={item.appliedDate}
              status={item.status}
              onClick={() => navigate(`/hr/applicants/${item.id}`)}
            />
          )}
        />

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