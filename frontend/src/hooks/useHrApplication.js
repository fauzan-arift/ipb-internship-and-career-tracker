import { useState, useEffect, useCallback } from 'react';
import { hrApplicationService } from '@/services/hrApplicationService';

export function useHrApplication(applicationId) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchApplication = useCallback(async () => {
    if (!applicationId) {
      setApplication(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await hrApplicationService.getApplicationDetail(applicationId);
      setApplication(data);
    } catch (err) {
      console.error('Failed to fetch application:', err);
      setError(err.response?.data?.detail || err.message || 'Gagal memuat data aplikasi');
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  const createOffer = useCallback(async (offerData) => {
    if (!applicationId) {
      throw new Error('Application ID is required');
    }

    setSubmitting(true);
    try {
      const result = await hrApplicationService.createOffer(applicationId, offerData);
      return result;
    } catch (err) {
      console.error('Failed to create offer:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [applicationId]);

  const uploadFile = useCallback(async (file) => {
    try {
      const result = await hrApplicationService.uploadDocument(file);
      return result;
    } catch (err) {
      console.error('Failed to upload file:', err);
      throw err;
    }
  }, []);

  const updateStatus = useCallback(async (status) => {
    if (!applicationId) {
      throw new Error('Application ID is required');
    }
    try {
      const result = await hrApplicationService.updateApplicationStatus(applicationId, status);
      setApplication(prev => ({ ...prev, status }));
      return result;
    } catch (err) {
      console.error('Failed to update status:', err);
      throw err;
    }
  }, [applicationId]);

  useEffect(() => {
    fetchApplication();
  }, [fetchApplication]);

  return {
    application,
    loading,
    error,
    submitting,
    refetch: fetchApplication,
    createOffer,
    uploadFile,
    updateStatus,
  };
}