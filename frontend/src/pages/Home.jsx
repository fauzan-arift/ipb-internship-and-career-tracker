import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom'; 

const Home = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Selamat Datang di IPB Internship Portal</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Sistem informasi terpadu untuk pelayanan Magang Mahasiswa dan Rekrutmen Perusahaan di IPB University.
        </p>
        <div className="flex space-x-4">
          <Link to="/login" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">Masuk (Login)</Link>
          <Link to="/register/student" className="px-6 py-2 bg-white text-blue-600 border border-blue-600 font-semibold rounded-lg shadow-sm hover:bg-gray-50">Daftar Mahasiswa</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-blue-600">
        <h2 className="text-3xl font-bold mb-2">Dashboard {user.role}</h2>
        <p className="text-gray-600 mb-6">Halo, <span className="font-semibold">{user.email}</span>. Anda login sebagai {user.role}.</p>
        
        <div className="grid grid-cols-2 gap-4">
          {user.role === 'ADMIN' && (
            <>
              <Link to="/admin/pending" className="flex flex-col items-center p-6 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
                <span className="text-2xl mb-2">📋</span>
                <span className="font-semibold text-blue-800">Review Pendaftar HR</span>
              </Link>
              <Link to="/admin/history" className="flex flex-col items-center p-6 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
                <span className="text-2xl mb-2">🗄️</span>
                <span className="font-semibold text-gray-800">History Pendaftaran HR</span>
              </Link>
            </>
          )}

            {user.role === 'STUDENT' && (
              <div 
                className="flex flex-col items-center p-6 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => navigate('/internship')}
              >
                <span className="text-2xl mb-2">🎓</span>
                <span className="font-semibold text-green-800">Cari Lowongan Magang</span>
              </div>
            )}

            {user.role === 'HR' && (
              <div className="flex flex-col items-center p-6 bg-purple-50 rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-100 transition-colors">
                <span className="text-2xl mb-2">🏢</span>
                <span className="font-semibold text-purple-800">Pasang Lowongan (Coming Soon)</span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Home;