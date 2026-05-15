const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

function getAuthHeader() {
  // Follows same pattern as internshipService — reads token from localStorage
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const studentService = {
  /**
   * GET /api/v1/students/profile
   * Returns full profile of the currently logged-in student.
   */
  async getProfile() {
    const res = await fetch(`${API_BASE}/students/profile`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw { response: { data: error, status: res.status } };
    }
    return res.json();
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
    const res = await fetch(`${API_BASE}/students/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw { response: { data: error, status: res.status } };
    }
    return res.json();
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
    formData.append('type', type);

    const res = await fetch(`${API_BASE}/api/v1/documents/upload`, {
      method: 'POST',
      headers: {
        // No Content-Type here — browser sets it with boundary for multipart
        ...getAuthHeader(),
      },
      body: formData,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw { response: { data: error, status: res.status } };
    }
    return res.json(); // { id, url }
  },
};