import { useState, useEffect, useCallback } from 'react';
import { applicationService } from '@/services/applicationService';
import { dummyApplications } from '@/data/dummyApplications';

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
        console.info('Data API kosong. Menggunakan dummy applications sebagai fallback.');
        setApplications(dummyApplications);
        setStats({
          total_applications: dummyApplications.length,
          processing_count: dummyApplications.filter(a => a.status === 'Diproses').length,
          accepted_count: dummyApplications.filter(a => a.status === 'Diterima').length,
          rejected_count: dummyApplications.filter(a => a.status === 'Ditolak').length,
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
      console.error('Failed to fetch applications:', err);
      setError(err.message || 'Gagal memuat daftar lamaran.');
      console.info('API error. Menggunakan dummy applications sebagai fallback.');
      setApplications(dummyApplications);
      setStats({
        total_applications: dummyApplications.length,
        processing_count: dummyApplications.filter(a => a.status === 'Diproses').length,
        accepted_count: dummyApplications.filter(a => a.status === 'Diterima').length,
        rejected_count: dummyApplications.filter(a => a.status === 'Ditolak').length,
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
      const dummyDetail = dummyApplications.find(app => app.id === id);
      if (dummyDetail) {
        setSelectedDetail({
          id: dummyDetail.id,
          internship: {
            title: dummyDetail.position,
            company: {
              company_name: dummyDetail.company,
              photo_profile_url: null,
            },
          },
          status: dummyDetail.status,
          application_time: dummyDetail.date,
          status_history: dummyDetail.timeline || [],
          offer: null,
          position: dummyDetail.position,
          company: dummyDetail.company,
          logo: dummyDetail.logo || '?',
        });
        return;
      }
    }

    setIsLoadingDetail(true);
    setError(null);
    try {
      const data = await applicationService.getApplicationDetail(id);
      setSelectedDetail(data);
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

  console.log('dummyDetail.timeline:', dummyDetail.timeline);
  console.log('status_history yang disimpan:', dummyDetail.timeline || []);
}