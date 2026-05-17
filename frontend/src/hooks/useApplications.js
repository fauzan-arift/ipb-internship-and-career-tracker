import { useState, useEffect, useCallback } from 'react';
import { applicationService } from '@/services/applicationService';
import { dummyApplications } from '@/data/dummyApplications';

const STATUS_CONFIG = {
  "Pending": {
    description: "Lamaran Anda telah masuk dan sedang menunggu untuk direview oleh tim HR."
  },
  "Diproses": {
    description: "Tim HR telah membuka lamaran Anda dan sedang dalam proses peninjauan awal."
  },
  "Review HR": {
    description: "Tim HR sedang mengevaluasi dokumen dan CV Anda secara lebih mendalam."
  },
  "Interview": {
    description: "Selamat! Anda diundang untuk mengikuti proses wawancara dengan tim perusahaan."
  },
  "Ditawarkan": {
    description: "Anda telah menerima penawaran magang! Silakan konfirmasi keputusan Anda."
  },
  "Diterima": {
    description: "Selamat! Anda telah resmi diterima sebagai peserta magang."
  },
  "Ditolak": {
    description: "Kami informasikan bahwa Anda belum lolos ke tahap selanjutnya. Semangat mencoba lagi!"
  }
};

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const getStatusDescription = (statusTitle) => {
  if (STATUS_CONFIG[statusTitle]) {
    return STATUS_CONFIG[statusTitle].description;
  }
  return `Status: ${statusTitle}`;
};

export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total_applications: 0,
    processing_count: 0,
    accepted_count: 0,
    rejected_count: 0,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [error, setError] = useState(null);
  const [useDummy, setUseDummy] = useState(false);

  const fetchApplications = useCallback(async () => {
    setIsLoadingList(true);
    setError(null);
    try {
      const data = await applicationService.listApplications();
      const apiApps = data.applications || [];
      const apiStats = data.stats || {};

      if (apiApps.length === 0) {
        console.info('📦 Data API kosong. Menggunakan dummy applications sebagai fallback.');
        setApplications(dummyApplications);
        setStats({
          total_applications: dummyApplications.length,
          processing_count: dummyApplications.filter((a) => a.status === 'Diproses').length,
          accepted_count: dummyApplications.filter((a) => a.status === 'Diterima').length,
          rejected_count: dummyApplications.filter((a) => a.status === 'Ditolak').length,
        });
        setUseDummy(true);
        if (!selectedId && dummyApplications.length > 0) {
          setSelectedId(dummyApplications[0].id);
        }
      } else {
        setApplications(apiApps);
        setStats(apiStats);
        setUseDummy(false);
        if (!selectedId && apiApps.length > 0) {
          setSelectedId(apiApps[0].id);
        }
      }
    } catch (err) {
      console.error('❌ Failed to fetch applications:', err);
      setError(err.message || 'Gagal memuat daftar lamaran.');
      console.info('⚠️ API error. Menggunakan dummy applications sebagai fallback.');
      setApplications(dummyApplications);
      setStats({
        total_applications: dummyApplications.length,
        processing_count: dummyApplications.filter((a) => a.status === 'Diproses').length,
        accepted_count: dummyApplications.filter((a) => a.status === 'Diterima').length,
        rejected_count: dummyApplications.filter((a) => a.status === 'Ditolak').length,
      });
      setUseDummy(true);
      if (!selectedId && dummyApplications.length > 0) {
        setSelectedId(dummyApplications[0].id);
      }
    } finally {
      setIsLoadingList(false);
    }
  }, [selectedId]);

  const fetchDetail = useCallback(async (id) => {
    if (!id) {
      setSelectedDetail(null);
      return;
    }

    if (useDummy) {
      const dummyDetail = dummyApplications.find((app) => app.id === id);
      if (dummyDetail) {
        setSelectedDetail({
          id: dummyDetail.id,
          position: dummyDetail.position,
          company: dummyDetail.company,
          logo: dummyDetail.logo || '?',
          status: dummyDetail.status,
          application_time: dummyDetail.date,
          status_history: dummyDetail.timeline || [],
          offer: null,
        });
        return;
      }
    }

    setIsLoadingDetail(true);
    setError(null);
    try {
      const data = await applicationService.getApplicationDetail(id);
      const currentStatus = data.status;
      const isFinalStatus = currentStatus === 'Diterima' || currentStatus === 'Ditolak';

      let transformedHistory = [];
      if (data.status_history && data.status_history.length > 0) {
        transformedHistory = data.status_history.map((item, index) => {
          const title = item.new_status;
          const isLast = index === data.status_history.length - 1;

          let state = 'done';
          if (isFinalStatus) {
            state = 'done';
          } else if (isLast) {
            state = 'active';
          }

          return {
            title: title,
            description: getStatusDescription(title),
            date: item.changed_at,
            state: state,
          };
        });
      }

      const detailForUI = {
        id: data.id,
        position: data.internship?.title || 'Posisi Tidak Diketahui',
        company: data.internship?.company?.company_name || 'Perusahaan Tidak Diketahui',
        logo: getInitials(data.internship?.company?.company_name) || '?',
        logoUrl: data.internship?.company?.photo_profile_url,
        status: data.status,
        application_time: data.application_time,
        status_history: transformedHistory,
        offer: data.offer,
      };

      setSelectedDetail(detailForUI);
    } catch (err) {
      console.error(`Failed to fetch detail for ${id}:`, err);
      setError(err.message || 'Gagal memuat detail lamaran.');
      setSelectedDetail(null);
    } finally {
      setIsLoadingDetail(false);
    }
  }, [useDummy]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    fetchDetail(selectedId);
  }, [selectedId, fetchDetail]);

  return {
    applications,
    stats,
    isLoadingList,
    isLoadingDetail,
    error,
    isUsingDummy: useDummy,
    refresh: fetchApplications,

    selectedId,
    setSelectedId,
    selectedDetail,
  };
}