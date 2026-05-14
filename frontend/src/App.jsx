import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';

// Components
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';
import Login from '@/pages/auth/Login';
import RegisterStudent from '@/pages/auth/RegisterStudent';
import RegisterHR from '@/pages/auth/RegisterHR';
import VerifyEmail from '@/pages/auth/VerifyEmail';
import PendingList from '@/pages/admin/PendingList';
import HRDetail from '@/pages/admin/HRDetail';
import HistoryList from '@/pages/admin/HistoryList';
import CariLowongan from '@/pages/mahasiswa/CariLowongan';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="text-center mt-10">Loading auth state...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="bg-white text-center py-4 text-sm text-gray-500 mt-auto border-t">
        &copy; 2026 IPB Internship Portal
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth Routes — tanpa Navbar & footer App */}
          <Route path="/login" element={<Login />} />
          <Route path="/register/student" element={<RegisterStudent />} />
          <Route path="/register/hr" element={<RegisterHR />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* App Routes — dengan Navbar & footer */}
          <Route path="/" element={<AppLayout><Home /></AppLayout>} />
        
          <Route
            path="/admin/pending"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AppLayout><PendingList /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hr/profile/:hr_profile_id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AppLayout><HRDetail /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/history"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AppLayout><HistoryList /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/lowongan"
            element={
              <ProtectedRoute allowedRoles={['MAHASISWA', 'STUDENT']}>
                <AppLayout><CariLowongan /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;