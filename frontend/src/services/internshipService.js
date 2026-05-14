import api from '@/api/axios';

const BASE_PATH = '/internships/';

export const internshipService = {
  listActiveInternships: async ({ page = 1, limit = 20, search = '' } = {}) => {
    const params = {
      page,
      limit,
    };
    if (search) {
      params.search = search;
    }

    const response = await api.get(BASE_PATH, { params });
    return response.data;
  },
};

export default internshipService;
