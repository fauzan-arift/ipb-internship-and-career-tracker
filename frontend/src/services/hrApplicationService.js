import axios from '@/api/axios';

export const hrApplicationService = {
  getApplicationDetail: async (applicationId) => {
    const response = await axios.get(`/hr/applications/${applicationId}`);
    return response.data;
  },

  updateStatus: async (applicationId, newStatus) => {
    const response = await axios.patch(`/hr/applications/${applicationId}/status`, {
      new_status: newStatus,
    });
    return response.data;
  },

  createOffer: async (applicationId, offerData) => {
    const response = await axios.post(`/hr/applications/${applicationId}/offers`, offerData);
    return response.data;
  },

  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', 'OTHER'); // Tambahkan document_type yang diminta backend
    const response = await axios.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getAllApplicants: async (params) => {
    const response = await axios.get('/hr/applications', { params });
    return response.data;
  },
};