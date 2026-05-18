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
import MyApplications from '@/pages/student/MyApplications';
import OffersPage from '@/pages/student/OffersPage';

import HRDashboard from '@/pages/hr/HRDashboard';
import CreateInternship from '@/pages/hr/CreateInternship';
import EditInternship from '@/pages/hr/EditInternship';
import ApplicantList from '@/pages/hr/ApplicantList';
import ApplicantDetail from '@/pages/hr/ApplicantDetail';
import OfferApplicant from '@/pages/hr/OfferApplicant';
import CompanyProfile from '@/pages/hr/CompanyProfile';

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
      {/* ── Public / Auth ── */}
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route
        path="/register/student"
        element={
          <DashboardLayout showSidebar={false}>
            <RegisterStudent />
          </DashboardLayout>
        }
      />
      <Route
        path="/register/hr"
        element={
          <DashboardLayout showSidebar={false}>
            <RegisterHR />
          </DashboardLayout>
        }
      />

      {/* ── Home ── */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ── Admin ── */}
      <Route
        path="/admin/dashboard"
        element={(
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout role="admin" showSidebar={false}>
              <PendingList />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/admin/hr/profile/:hr_profile_id"
        element={(
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardLayout role="admin" showSidebar={false}>
              <HRDetail />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />

      {/* ── Student ── */}
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
        path="/my-application"
        element={(
          <ProtectedRoute allowedRoles={['MAHASISWA', 'STUDENT']}>
            <DashboardLayout role="student">
              <MyApplications />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/offers"
        element={(
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <DashboardLayout role="student">
              <OffersPage />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />

      {/* ── HR ── */}
      <Route
        path="/hr/dashboard"
        element={(
          <ProtectedRoute allowedRoles={['HR']}>
            <DashboardLayout role="hr">
              <HRDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/hr/dashboard/new"
        element={(
          <ProtectedRoute allowedRoles={['HR']}>
            <DashboardLayout role="hr">
              <CreateInternship />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/hr/dashboard/:internship_id/edit"
        element={(
          <ProtectedRoute allowedRoles={['HR']}>
            <DashboardLayout role="hr">
              <EditInternship />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/hr/applicants"
        element={(
          <ProtectedRoute allowedRoles={['HR']}>
            <DashboardLayout role="hr">
              <ApplicantList />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/hr/applicants/:applicant_id"
        element={(
          <ProtectedRoute allowedRoles={['HR']}>
            <DashboardLayout role="hr">
              <ApplicantDetail />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/hr/applicant/:application_id/offer"
        element={(
          <ProtectedRoute allowedRoles={['HR']}>
            <DashboardLayout role="hr">
              <OfferApplicant />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      />

      <Route
        path="/hr/profile"
        element={(
          <ProtectedRoute allowedRoles={['HR']}>
            <DashboardLayout role="hr">
              <CompanyProfile />
            </DashboardLayout>
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