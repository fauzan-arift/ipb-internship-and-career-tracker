import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api/axios';

const PendingList = () => {
  const [hrs, setHrs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await api.get('/admin/pending-registrations');
        if (res.data.success) {
          setHrs(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.detail || 'Gagal memuat data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPending();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Daftar Pendaftaran HR (Menunggu Verifikasi)</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      {isLoading ? (
        <p>Loading data...</p>
      ) : hrs.length === 0 ? (
        <p className="bg-white p-6 rounded shadow text-center text-gray-500">Tidak ada pendaftaran HR yang pending saat ini.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama HR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Perusahaan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Daftar</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hrs.map((hr) => (
                <tr key={hr.hr_profile_id || hr.hr_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hr.full_name} <br/><span className="text-xs text-gray-500 font-normal">{hr.position || '-'}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hr.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hr.company_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(hr.registered_at).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/hr/profile/${hr.hr_profile_id || hr.hr_id}`} className="text-blue-600 hover:text-blue-900 font-bold">Lihat Detail</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingList;
