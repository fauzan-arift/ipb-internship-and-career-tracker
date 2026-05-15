import React, { useState, useEffect } from 'react';
import StatCard from '@/components/molecules/StatCard';
import ApplicationListItem from '@/components/molecules/ApplicationListItem';
import ApplicationDetailPanel from '@/components/organisms/ApplicationDetailPanel';
import { useApplications } from '@/hooks/useApplications';
import { dummyApplications } from '@/data/dummyApplications'; // kamu perlu buat file ini

function MyApplications() {
  const {
    applications: apiApplications,
    stats: apiStats,
    isLoadingList,
    isLoadingDetail,
    error,
    selectedId,
    setSelectedId,
    selectedDetail,
    refresh,
  } = useApplications();

  // STATE untuk dummy + fallback
  const [useDummy, setUseDummy] = useState(false);
  const [localSelectedId, setLocalSelectedId] = useState(dummyApplications[0]?.id || null);

  // Jika API error atau data kosong, fallback ke dummy
  useEffect(() => {
    if (error || (apiApplications.length === 0 && !isLoadingList)) {
      setUseDummy(true);
    } else if (apiApplications.length > 0) {
      setUseDummy(false);
    }
  }, [apiApplications, error, isLoadingList]);

  // Tentukan data yang ditampilkan
  const displayApplications = useDummy ? dummyApplications : apiApplications;
  const displayStats = useDummy
    ? {
        total_applications: dummyApplications.length,
        processing_count: dummyApplications.filter(a => a.status === 'Diproses').length,
        accepted_count: dummyApplications.filter(a => a.status === 'Diterima').length,
        rejected_count: dummyApplications.filter(a => a.status === 'Ditolak').length,
      }
    : apiStats;

  const activeId = useDummy ? localSelectedId : selectedId;
  const activeApp = useDummy
    ? dummyApplications.find(a => a.id === activeId)
    : selectedDetail;

  // Mapping dummy ke format API (untuk ApplicationDetailPanel)
    const mappedDetail = useDummy && activeApp
    ? {
        id: activeApp.id,
        internship: {
            title: activeApp.position,
            company: {
            company_name: activeApp.company,
            photo_profile_url: null,
            },
        },
        // ⚠️ PENTING: Kalau API belum ada, kita kasih logo dummy di sini
        logo: activeApp.logo || '?', 
        status: activeApp.status,
        application_time: activeApp.date,
        status_history: activeApp.timeline || [],
        offer: null,
        }
    : activeApp;

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Lamaran Saya</h1>

      {/* Statistik */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Lamaran" value={displayStats.total_applications || 0} />
        <StatCard label="Sedang Diproses" value={displayStats.processing_count || 0} variant="blue" />
        <StatCard label="Diterima" value={displayStats.accepted_count || 0} variant="green" />
        <StatCard label="Ditolak" value={displayStats.rejected_count || 0} variant="red" />
      </div>

      {/* Layout 2 Kolom */}
      <div className="flex gap-6 h-[calc(100vh-250px)]">
        {/* Kiri: Daftar Lamaran */}
        <div className="w-7/12 bg-white rounded-xl border border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-semibold text-gray-800 mb-4">Daftar Lamaran Magang</h3>
          {isLoadingList && !useDummy ? (
            <div className="text-center py-8 text-gray-500">Memuat lamaran...</div>
          ) : (
            <div className="space-y-3">
              {displayApplications.map((app) => (
                <ApplicationListItem
                key={app.id}
                logo={app.logo || app.internship?.company?.company_name?.[0] || '?'}
                position={app.position || app.internship?.title || 'Posisi Tidak Diketahui'}
                company={app.company || app.internship?.company?.company_name || 'Perusahaan Tidak Diketahui'}
                date={app.date || app.application_time}
                status={app.status}
                isActive={activeId === app.id}
                onClick={() => {
                    if (useDummy) {
                    setLocalSelectedId(app.id);
                    } else {
                    setSelectedId(app.id);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Kanan: Detail Panel */}
        <div className="w-5/12 overflow-y-auto">
          {isLoadingDetail && !useDummy ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              Memuat detail...
            </div>
          ) : (
            <ApplicationDetailPanel application={mappedDetail} />
          )}
        </div>
      </div>
    </div>
  );
}

export default MyApplications;