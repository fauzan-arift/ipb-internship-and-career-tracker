import api from '@/api/axios';
 
const BASE_PATH = '/internships';
 
export const internshipService = {
  listActiveInternships: async ({ page = 1, limit = 20, search = '' } = {}) => {
    const params = { page, limit };
    if (search) params.search = search;
    const response = await api.get(BASE_PATH, { params });
    return response.data;
  },
 
  getDetail: async (internshipId) => {
    const response = await api.get(`${BASE_PATH}/${internshipId}`);
    return response.data;
  },
 

  apply: async (internshipId, cvId) => {
    const response = await api.post(`${BASE_PATH}/${internshipId}/apply`, {
      submitted_cv_id: cvId,
    });
    return response.data;
  },
};
 
export default internshipService;