import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';

// Layouts
import DashboardLayout from '@/layouts/DashboardLayout';
import PublicLayout from '@/layouts/PublicLayout';

// Pages — Auth
import Login from '@/pages/auth/Login';
import RegisterStudent from '@/pages/auth/RegisterStudent';
import RegisterHR from '@/pages/auth/RegisterHR';
import VerifyEmail from '@/pages/auth/VerifyEmail';

// Pages — Public/Home
import Home from '@/pages/Home';

// Pages — Admin
import PendingList from '@/pages/admin/PendingList';
import HRDetail from '@/pages/admin/HRDetail';

// Pages — Student
import CariLowongan from '@/pages/mahasiswa/CariLowongan';
import InternshipDetail from '@/pages/mahasiswa/InternshipDetail';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ── Auth pages (no sidebar, centered header) ── */}
          <Route path="/login"              element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register/student"   element={<PublicLayout><RegisterStudent /></PublicLayout>} />
          <Route path="/register/hr"        element={<PublicLayout><RegisterHR /></PublicLayout>} />
          <Route path="/verify-email"       element={<PublicLayout><VerifyEmail /></PublicLayout>} />

          {/* ── Public home (header + footer, no sidebar) ── */}
          <Route path="/"
            element={
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />

          {/* ── Admin pages ── */}
          <Route path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout role="admin">
                  <PendingList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/admin/hr/profile/:hr_profile_id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout role="admin">
                  <HRDetail />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ── Student pages ── */}
          <Route path="/lowongan"
            element={
              <ProtectedRoute allowedRoles={['MAHASISWA']}>
                <DashboardLayout role="student">
                  <CariLowongan />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route path="/lowongan/:internship_id"
            element={
              <ProtectedRoute allowedRoles={['MAHASISWA']}>
                <DashboardLayout role="student">
                  <InternshipDetail />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;