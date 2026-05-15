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
import InternshipDetail from '@/pages/student/InternshipDetail';
import InternshipSearch from '@/pages/student/InternshipSearch';
import MyApplications from './pages/student/MyApplications';
import StudentProfile from '@/pages/student/StudentProfile';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="text-center mt-10">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* ── Auth pages ── */}
      <Route path="/login"            element={<Login />} />
      <Route path="/register/student" element={<RegisterStudent />} />
      <Route path="/register/hr"      element={<RegisterHR />} />
      <Route path="/verify-email"     element={<VerifyEmail />} />

      {/* ── Public home ── */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />

      {/* ── Admin pages ── */}
      <Route path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
              <PendingList />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/hr/profile/:hr_profile_id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
              <HRDetail />
          </ProtectedRoute>
        }
      />

      {/* ── Student pages ── */}
      <Route path="/internship"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout role="student">
              <InternshipSearch />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/internship/:internship_id"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout role="student">
              <InternshipDetail />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      
      <Route path="/profile"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout role="student">
              <StudentProfile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ── Fallback ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
          <Route path="/admin/dashboard" element={<PendingList />} />
          <Route path="/admin/perusahaan/:id" element={<HRDetail />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <PendingList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/hr/profile/:hr_profile_id"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <HRDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/internship"
            element={
              <ProtectedRoute allowedRoles={['MAHASISWA', 'STUDENT']}>
                <AppLayout><InternshipSearch /></AppLayout>
              </ProtectedRoute>
            }
          />

          
          <Route
            path="/my-application"
            element={
              <ProtectedRoute allowedRoles={['MAHASISWA', 'STUDENT']}>
                <AppLayout><MyApplications /></AppLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;