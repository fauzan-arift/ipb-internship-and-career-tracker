export const dummyHrApplications = {
  '3fa85f64-5717-4562-b3fc-2c963f66afa6': {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    status: 'Diproses',
    application_time: '2026-05-16T03:39:54.168Z',
    position: 'Data Analyst Intern',
    student: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      full_name: 'Muhammad Arif Agung Wijaya',
      nim: 'G64190012',
      major: 'Ilmu Komputer',
      faculty: 'SSMI',
      gpa: 4.0,
      phone_number: '0881024367265',
      email: 'muhmuhammad@apps.ipb.ac.id',
      skills: ['Data Science', 'Machine Learning', 'SQL', 'Cloud Computing'],
      cv_url: 'https://cloudinary.com/.../cv_muhammad_arif.pdf',
    },
    status_history: [
      { stage: 'Lamaran Terkirim', status: 'completed', date: '2026-05-12T09:00:00Z' },
      { stage: 'Seleksi Administrasi', status: 'completed', date: '2026-05-14T14:15:00Z' },
      { stage: 'Sedang Direview HR', status: 'in-progress', date: '2026-05-18T10:30:00Z' },
    ],
  },
  '3fa85f64-5717-4562-b3fc-2c963f66afa7': {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
    status: 'Diterima',
    application_time: '2026-05-15T10:00:00Z',
    position: 'IT Risk Assurance Intern',
    student: {
      id: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
      full_name: 'Budi Santoso',
      nim: 'G64190013',
      major: 'Teknologi Informasi',
      faculty: 'SSMI',
      gpa: 3.8,
      phone_number: '081234567890',
      email: 'budi@apps.ipb.ac.id',
      skills: ['Risk Management', 'Audit', 'Python'],
      cv_url: 'https://cloudinary.com/.../cv_budi.pdf',
    },
    status_history: [
      { stage: 'Lamaran Terkirim', status: 'completed', date: '2026-05-10T09:00:00Z' },
      { stage: 'Seleksi Administrasi', status: 'completed', date: '2026-05-12T11:00:00Z' },
      { stage: 'Seleksi Berkas', status: 'completed', date: '2026-05-14T09:30:00Z' },
      { stage: 'Wawancara', status: 'completed', date: '2026-05-16T14:00:00Z' },
      { stage: 'Diterima', status: 'accepted', date: '2026-05-18T16:00:00Z' },
    ],
  },
};

// Helper untuk mendapatkan dummy data berdasarkan ID
export function getDummyHrApplication(id) {
  return dummyHrApplications[id] || null;
}

// Helper untuk mendapatkan dummy list (untuk applicant list)
export const dummyHrApplicationList = Object.values(dummyHrApplications);