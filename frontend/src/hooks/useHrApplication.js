import { useState, useEffect, useCallback } from 'react';
import { hrApplicationService } from '@/services/hrApplicationService';
import { getDummyHrApplication } from '@/data/dummyHrApplications';
import dummyApplicants from '@/data/dummyApplicants';

function transformApplicantToHrApplication(applicant) {
  if (!applicant) return null;
  return {
    id: applicant.id,
    status: applicant.status,
    application_time: applicant.appliedDate,
    position: applicant.position,
    student: {
      id: applicant.id,
      full_name: applicant.fullName,
      nim: applicant.nim,
      major: applicant.studyProgram,
      faculty: applicant.faculty,
      gpa: parseFloat(applicant.ipk),
      phone_number: applicant.phone,
      email: applicant.email,
      skills: applicant.skills,
      cv_url: applicant.cvDocument?.name,
    },
    status_history: applicant.timeline?.map(item => ({
      stage: item.stage,
      status: item.status,
      date: item.date,
    })) || [],
  };
}

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
        const transformedData = {
          ...data,
          status_history: (data.status_history || []).map((item, idx) => {
            let mappedStatus = 'completed';
            if (['Diterima', 'Accepted'].includes(item.new_status)) {
              mappedStatus = 'accepted';
            } else if (['Ditolak', 'Rejected'].includes(item.new_status)) {
              mappedStatus = 'rejected';
            } else if (idx === (data.status_history || []).length - 1) {
              mappedStatus = 'in-progress';
            }
            
            return {
              stage: item.new_status ? item.new_status.charAt(0).toUpperCase() + item.new_status.slice(1) : `Status ${idx + 1}`,
              status: mappedStatus,
              date: item.changed_at,
            };
          }),
        };
        setApplication(transformedData);
        setUsingDummy(false);
      } else {
        setApplication(null);
        setError("Data pelamar tidak ditemukan");
      }
    } catch (err) {
      console.error('API error fetching HR application detail:', err);
      setApplication(null);
      setError(err.message || "Gagal memuat detail pelamar");
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