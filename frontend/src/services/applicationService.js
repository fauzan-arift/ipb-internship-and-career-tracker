import axios from '@/api/axios';

export const applicationService = {
  // Get all applications + stats
  listApplications: async () => {
    const response = await axios.get('/students/applications');
    return response.data;
  },

  // Get detail of a single application
  getApplicationDetail: async (applicationId) => {
    const response = await axios.get(`/students/applications/${applicationId}`);
    return response.data;
  },
};