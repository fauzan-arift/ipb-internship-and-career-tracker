import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-800 p-4 text-white shadow-md flex justify-between items-center">
      <div>
        <Link to="/" className="text-xl font-bold">IPB Internship Portal</Link>
      </div>
      <div>
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm">Hi, {user?.email} ({user?.role})</span>
            <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 font-semibold">
              Logout
            </button>
          </div>
        ) : (
          <div className="flex space-x-3">
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register/student" className="bg-white text-blue-800 px-3 py-1 rounded font-semibold hover:bg-gray-100">
              Daftar Mahasiswa
            </Link>
            <Link to="/register/hr" className="bg-green-500 px-3 py-1 rounded font-semibold hover:bg-green-600">
              Daftar HR
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;