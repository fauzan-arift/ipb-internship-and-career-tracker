import api from '@/api/axios';

const BASE_PATH = '/hr/internships';

const hrService = {
  // ── yang sudah ada, jangan diubah ──
  listHRInternships: async ({ page = 1, limit = 20, search = '' } = {}) => {
    const params = { page, limit };
    if (search) params.search = search;
    const response = await api.get(BASE_PATH, { params });
    return response.data;
  },
  createInternship: async (payload) => {
    const response = await api.post(BASE_PATH, payload);
    return response.data;
  },
  getInternshipDetail: async (id) => {
    const response = await api.get(`/internships/${id}`);
    return response.data;
  },
  updateInternship: async (id, payload) => {
    const response = await api.put(`${BASE_PATH}/${id}`, payload);
    return response.data;
  },
  closeInternship: async (id) => {
    const response = await api.patch(`${BASE_PATH}/${id}/close`);
    return response.data;
  },
  deleteInternship: async (id) => {
    const response = await api.delete(`${BASE_PATH}/${id}`);
    return response.data;
  },

  // ── tambahan baru: company profile ──
  getProfile: async () => {
    const response = await api.get('/hr/company-profile');
    return response.data;
  },
  updateProfile: async (payload) => {
    const response = await api.put('/hr/company-profile', payload);
    return response.data;
  },
  uploadPhoto: async (file) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('document_type', 'PROFILE_PHOTO');

  const res = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/documents/upload`, {
    method: 'POST',
    headers: {
      // No Content-Type — browser handles multipart boundary
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw { response: { data: error, status: res.status } };
  }
  return res.json();
  },
};

export default hrService;