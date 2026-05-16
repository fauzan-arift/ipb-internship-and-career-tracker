import React from 'react';
import StatCard from '@/components/molecules/StatCard';
import ApplicationListItem from '@/components/molecules/ApplicationListItem';
import ApplicationDetailPanel from '@/components/organisms/ApplicationDetailPanel';
import { useApplications } from '@/hooks/useApplications';

function MyApplications() {
  const {
    applications,
    stats,
    isLoadingList,
    isLoadingDetail,
    error,
    isUsingDummy,
    selectedId,
    setSelectedId,
    selectedDetail,
  } = useApplications();

  if (isLoadingList && applications.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Memuat lamaran...
      </div>
    );
  }

  if (error && applications.length === 0) {
    return (
      <div className="h-full">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 mb-6">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Lamaran Saya</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Lamaran" value={stats.total_applications || 0} />
        <StatCard label="Sedang Diproses" value={stats.processing_count || 0} variant="blue" />
        <StatCard label="Diterima" value={stats.accepted_count || 0} variant="green" />
        <StatCard label="Ditolak" value={stats.rejected_count || 0} variant="red" />
      </div>

      <div className="flex gap-6 items-start" style={{ paddingBottom: '24px' }}>
        <div className="w-7/12 bg-white rounded-xl border border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-semibold text-gray-800 mb-4">Daftar Lamaran Magang</h3>
          {isLoadingList && applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Memuat lamaran...</div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const logo = app.logo || app.internship?.company?.company_name?.[0] || '?';
                const position = app.position || app.internship?.title || 'Posisi Tidak Diketahui';
                const company = app.company || app.internship?.company?.company_name || 'Perusahaan Tidak Diketahui';
                const date = app.date || app.application_time;

                return (
                  <ApplicationListItem
                    key={app.id}
                    logo={logo}
                    position={position}
                    company={company}
                    date={date}
                    status={app.status}
                    isActive={selectedId === app.id}
                    onClick={() => setSelectedId(app.id)}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoadingDetail && !isUsingDummy ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              Memuat detail...
            </div>
          ) : (
            <ApplicationDetailPanel application={selectedDetail} />
          )}
        </div>
      </div>
    </div>
  );
}

export default MyApplications;