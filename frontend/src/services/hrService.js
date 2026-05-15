import api from '@/api/axios';

const BASE_PATH = '/hr/internships';

const hrService = {
  listHRInternships: async ({ page = 1, limit = 20, search = '' } = {}) => {
    const params = { page, limit };
    if (search) params.search = search;
    const response = await api.get(BASE_PATH, { params });
    return response.data;
  },

  // additional HR-related actions can be added here (create/update/close)
};

export default hrService;
