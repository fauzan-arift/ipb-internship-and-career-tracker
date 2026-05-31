import axios from '@/api/axios';

export const applicationService = {

  listApplications: async () => {
    const response = await axios.get('/students/applications');
    return response.data;
  },


  getApplicationDetail: async (applicationId) => {
    const response = await axios.get(`/students/applications/${applicationId}`);
    return response.data;
  },
};