import { useState, useEffect, useCallback } from 'react';
import { hrApplicationService } from '@/services/hrApplicationService';
import { getDummyHrApplication } from '@/data/dummyHrApplications';

export function useHrApplication(applicationId) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [usingDummy, setUsingDummy] = useState(false);

  const fetchApplication = useCallback(async () => {
    if (!applicationId) {
      setApplication(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setUsingDummy(false);

    try {
      const data = await hrApplicationService.getApplicationDetail(applicationId);
      
      if (data && data.id) {
        setApplication(data);
        setUsingDummy(false);
      } else {
        console.warn('API mengembalikan data kosong, menggunakan dummy data');
        const dummyData = getDummyHrApplication(applicationId);
        if (dummyData) {
          setApplication(dummyData);
          setUsingDummy(true);
        } else {
          setApplication(null);
        }
      }
    } catch (err) {
      console.error('API error, menggunakan dummy data:', err.message);
      const dummyData = getDummyHrApplication(applicationId);
      if (dummyData) {
        setApplication(dummyData);
        setUsingDummy(true);
      } else {
        setApplication(null);
      }
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  const createOffer = useCallback(async (offerData) => {
    if (!applicationId) throw new Error('Application ID is required');
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
      return await hrApplicationService.uploadDocument(file);
    } catch (err) {
      console.error('Failed to upload file:', err);
      throw err;
    }
  }, []);

  const updateStatus = useCallback(async (status) => {
    if (!applicationId) throw new Error('Application ID is required');
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
    usingDummy,
    refetch: fetchApplication,
    createOffer,
    uploadFile,
    updateStatus,
  };
}