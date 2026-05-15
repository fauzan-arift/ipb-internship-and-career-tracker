import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth'; 

const Home = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

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

  // If user is authenticated, redirect them to their respective dashboards
  if (user.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (user.role === 'STUDENT') {
    return <Navigate to="/internship" replace />;
  }
  if (user.role === 'HR') {
    // Placeholder for HR dashboard
    return <Navigate to="/hr/dashboard" replace />;
  }

  return null;
};

export default Home;