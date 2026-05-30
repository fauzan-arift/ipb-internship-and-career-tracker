import React from 'react';
import StatCard from '@/components/molecules/StatCard';
import ApplicationListItem from '@/components/molecules/ApplicationListItem';
import ApplicationDetailPanel from '@/components/organisms/ApplicationDetailPanel';
import { useApplications } from '@/hooks/useApplications';

// ---------------------------------------------------------------------------
// Skeleton primitives
// ---------------------------------------------------------------------------

const Shimmer = ({ className = '', style = {} }) => (
  <div
    className={`relative overflow-hidden bg-gray-100 rounded ${className}`}
    style={{ isolation: 'isolate', ...style }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
        animation: 'shimmer 1.6s infinite',
      }}
    />
    <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
  </div>
);

const StatCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3">
    <Shimmer className="h-3 w-24 rounded-full" />
    <Shimmer className="h-8 w-12 rounded-md" />
  </div>
);

const ApplicationListItemSkeleton = () => (
  <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-100">
    <Shimmer className="w-11 h-11 rounded-lg flex-shrink-0" />
    <div className="flex-1 flex flex-col gap-2 min-w-0">
      <Shimmer className="h-3.5 w-40 rounded-full" />
      <Shimmer className="h-3 w-28 rounded-full" />
    </div>
    <div className="flex flex-col items-end gap-2 flex-shrink-0">
      <Shimmer className="h-3 w-20 rounded-full" />
      <Shimmer className="h-5 w-16 rounded-full" />
    </div>
  </div>
);

const ApplicationDetailPanelSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-6">
    <div className="flex items-center gap-4">
      <Shimmer className="w-14 h-14 rounded-xl flex-shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <Shimmer className="h-4 w-48 rounded-full" />
        <Shimmer className="h-3 w-32 rounded-full" />
      </div>
      <Shimmer className="h-7 w-24 rounded-full flex-shrink-0" />
    </div>

    <div className="border-t border-gray-100" />

    {[100, 80, 90].map((w, i) => (
      <div key={i} className="flex flex-col gap-1.5">
        <Shimmer className="h-3 w-20 rounded-full" />
        <Shimmer className="h-3.5 rounded-full" style={{ width: `${w}%` }} />
      </div>
    ))}

    <div className="border-t border-gray-100" />

    <div className="flex flex-col gap-2">
      <Shimmer className="h-3 w-28 rounded-full" />
      <div className="flex flex-col gap-1.5 mt-1">
        {['100%', '91.67%', '80%', '100%', '75%'].map((w, i) => (
          <Shimmer key={i} className="h-3 rounded-full" style={{ width: w }} />
        ))}
      </div>
    </div>

    <Shimmer className="h-10 w-full rounded-lg mt-2" />
  </div>
);

const MyApplicationsSkeleton = () => (
  <div className="h-full p-0">
    <Shimmer className="h-7 w-48 rounded-full mb-6" />
    <div className="grid grid-cols-4 gap-4 mb-6">
      {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
    </div>
    <div className="flex gap-6 items-start pb-6">
      <div className="w-7/12 bg-white rounded-xl border border-gray-200 p-4">
        <Shimmer className="h-4 w-44 rounded-full mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <ApplicationListItemSkeleton key={i} />)}
        </div>
      </div>
      <div className="flex-1">
        <ApplicationDetailPanelSkeleton />
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

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
    return <MyApplicationsSkeleton />;
  }

  if (error && applications.length === 0) {
    return (
      <div className="h-full p-0">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 mb-6">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Lamaran Saya</h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Lamaran" value={stats.total_applications || 0} />
        <StatCard label="Sedang Diproses" value={stats.processing_count || 0} variant="blue" />
        <StatCard label="Diterima" value={stats.accepted_count || 0} variant="green" />
        <StatCard label="Ditolak" value={stats.rejected_count || 0} variant="red" />
      </div>

      <div className="flex gap-6 items-start pb-6">
        <div className="w-7/12 bg-white rounded-xl border border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-semibold text-gray-800 mb-4">Daftar Lamaran Magang</h3>
          {isLoadingList && applications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Memuat lamaran...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="font-medium text-gray-600">Belum ada lamaran magang</p>
              <p className="text-sm text-gray-400 mt-1">Silakan cari lowongan magang dan ajukan lamaran Anda.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => {
                const logo = app.logo || app.internship?.company?.company_name?.[0] || '?';
                const logoUrl = app.internship?.company?.photo_profile_url;
                const position = app.position || app.internship?.title || 'Posisi Tidak Diketahui';
                const company = app.company || app.internship?.company?.company_name || 'Perusahaan Tidak Diketahui';
                const date = app.date || app.application_time;

                return (
                  <ApplicationListItem
                    key={app.id}
                    logo={logo}
                    logoUrl={logoUrl}
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
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500">
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