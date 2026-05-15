import { useState, useEffect, useCallback } from 'react';
import { applicationService } from '@/services/applicationService';

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

  // --- FETCH LIST + STATS ---
  const fetchApplications = useCallback(async () => {
    setIsLoadingList(true);
    setError(null);
    try {
      const data = await applicationService.listApplications();
      setApplications(data.applications || []);
      setStats(data.stats || {});
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError(err.message || 'Gagal memuat daftar lamaran.');
    } finally {
      setIsLoadingList(false);
    }
  }, []);

  // --- FETCH DETAIL (selected) ---
  const fetchDetail = useCallback(async (id) => {
    if (!id) {
      setSelectedDetail(null);
      return;
    }
    setIsLoadingDetail(true);
    setError(null);
    try {
      const data = await applicationService.getApplicationDetail(id);
      setSelectedDetail(data);
    } catch (err) {
      console.error(`Failed to fetch detail for ${id}:`, err);
      setError(err.message || 'Gagal memuat detail lamaran.');
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  // --- AUTO FETCH LIST ON MOUNT ---
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // --- AUTO FETCH DETAIL WHEN selectedId CHANGES ---
  useEffect(() => {
    fetchDetail(selectedId);
  }, [selectedId, fetchDetail]);

  return {
    // List & stats
    applications,
    stats,
    isLoadingList,
    isLoadingDetail,
    error,
    refresh: fetchApplications,

    // Selection
    selectedId,
    setSelectedId,
    selectedDetail,
  };
}