import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/api/axios';

const HistoryList = () => {
  const [hrs, setHrs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/admin/hr/history');
        if (res.data.success) {
          setHrs(res.data.data);
        }
      } catch (err) {
        setError(err.response?.data?.detail || 'Gagal memuat history data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">History Pendaftaran HR</h2>
        <Link to="/admin/pending" className="text-blue-600 hover:underline">Lihat yang Pending →</Link>
      </div>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      {isLoading ? (
        <p>Loading data...</p>
      ) : hrs.length === 0 ? (
        <p className="bg-white p-6 rounded shadow text-center text-gray-500">Belum ada history pendaftaran HR yang diproses.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan & HR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Proses</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hrs.map((hr) => (
                <tr key={hr.hr_profile_id || hr.hr_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">{hr.company_name}</div>
                    <div className="text-sm text-gray-500">{hr.full_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      hr.status === 'verified' 
                        ? 'bg-green-100 text-green-800' 
                        : hr.status === 'rejected' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {hr.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {hr.verified_at ? new Date(hr.verified_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/hr/profile/${hr.hr_profile_id || hr.hr_id}`} className="text-blue-600 hover:text-blue-900">Lihat Detail</Link>
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

export default HistoryList;
