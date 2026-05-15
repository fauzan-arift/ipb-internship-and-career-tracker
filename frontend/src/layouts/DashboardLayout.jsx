import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({ children, role }) {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      {/* Header spans full width */}
      <Header variant="app" user={user} onLogout={logout} />

      {/* Sidebar + content sit side by side, grow to fill remaining height */}
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar role={role} />
        <main style={{ flex: 1, minWidth: 0, padding: '24px', backgroundColor: '#F3F4F6' }}>
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}