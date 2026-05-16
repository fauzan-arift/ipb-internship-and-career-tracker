import axios from '@/api/axios';

export const hrApplicationService = {
  // Get detail application (student info, status history, etc.)
  getApplicationDetail: async (applicationId) => {
    const response = await axios.get(`/hr/applications/${applicationId}`);
    return response.data;
  },

  // Update application status
  updateApplicationStatus: async (applicationId, status) => {
    const response = await axios.patch(`/hr/applications/${applicationId}/status`, { status });
    return response.data;
  },

  // Create offer for application
  createOffer: async (applicationId, offerData) => {
    const response = await axios.post(`/hr/applications/${applicationId}/offers`, offerData);
    return response.data;
  },

  // Upload document (for offering file)
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};