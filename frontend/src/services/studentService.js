import api from '@/api/axios';

export const studentService = {
  /**
   * GET /api/v1/students/profile
   * Returns full profile of the currently logged-in student.
   */
  async getProfile() {
    const response = await api.get('/students/profile');
    return response.data;
  },

  /**
   * GET /api/v1/skills
   * Returns list of all globally available skills
   */
  async getGlobalSkills() {
    const response = await api.get('/skills');
    return response.data;
  },

  /**
   * PUT /api/v1/students/profile
   * Partial update — only sends fields that changed.
   *
   * @param {Object} payload - Any subset of:
   *   full_name, email, nim, faculty, major, gpa,
   *   graduation_year, phone_number, skills,
   *   cv_id, photo_profile_id
   */
  async updateProfile(payload) {
    const response = await api.put('/students/profile', payload);
    return response.data;
  },

  /**
   * POST /api/v1/documents/upload
   * Upload a file (CV or photo). Returns { id, url }.
   * Pass the returned `id` as `cv_id` or `photo_profile_id` in updateProfile().
   *
   * @param {File} file
   * @param {"cv"|"photo"} type
   */
  async uploadDocument(file, type = 'cv') {
    const formData = new FormData();
    formData.append('file', file);

    // Map frontend 'type' to backend 'document_type' enum values
    let docType = 'OTHER';
    if (type.toLowerCase() === 'cv') docType = 'CV';
    else if (type.toLowerCase() === 'photo') docType = 'PROFILE_PHOTO';

    formData.append('document_type', docType);

    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * GET /api/v1/students/career-mapping
   * Returns career mapping distribution for the logged-in student's major.
   * Response: { faculty, major, grand_total_students, last_updated, company_distributions[] }
   */
  async getCareerMapping() {
    const response = await api.get('/students/career-mapping');
    return response.data;
  },
};
