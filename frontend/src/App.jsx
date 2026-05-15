import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';

import DashboardLayout from '@/layouts/DashboardLayout';
import PublicLayout from '@/layouts/PublicLayout';

import Login from '@/pages/auth/Login';
import RegisterStudent from '@/pages/auth/RegisterStudent';
import RegisterHR from '@/pages/auth/RegisterHR';
import VerifyEmail from '@/pages/auth/VerifyEmail';

import Home from '@/pages/Home';

import PendingList from '@/pages/admin/PendingList';
import HRDetail from '@/pages/admin/HRDetail';

import InternshipDetail from '@/pages/student/InternshipDetail';
import InternshipSearch from '@/pages/student/InternshipSearch';
import StudentProfile from '@/pages/student/StudentProfile';

import HRDashboard from '@/pages/hr/HRDashboard';
import CreateInternship from '@/pages/hr/CreateInternship';
import EditInternship from '@/pages/hr/EditInternship';

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
      <Route path="/login" element={<Login />} />
      <Route path="/register/student" element={<RegisterStudent />} />
      <Route path="/register/hr" element={<RegisterHR />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />

      <Route
        path="/admin/dashboard"
        element={(
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <PendingList />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/admin/hr/profile/:hr_profile_id"
        element={(
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <HRDetail />
          </ProtectedRoute>
        )}
      />

      <Route
        path="/internship"
        element={(
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout role="student">
              <InternshipSearch />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/internship/:internship_id"
        element={(
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout role="student">
              <InternshipDetail />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/profile"
        element={(
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout role="student">
              <StudentProfile />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />

      <Route
        path="/hr/dashboard"
        element={(
          <ProtectedRoute allowedRoles={['HR']}>
            <HRDashboard />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/hr/dashboard/baru"
        element={(
          <ProtectedRoute allowedRoles={['HR']}>
            <CreateInternship />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/hr/dashboard/:internship_id/edit"
        element={(
          <ProtectedRoute allowedRoles={['HR']}>
            <EditInternship />
          </ProtectedRoute>
        )}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
