import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({ children, role, showSidebar = true }) {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>

      {/* Header spans full width */}
      <Header variant="app" user={user} onLogout={logout} />

      {/* Sidebar + content sit side by side, grow to fill remaining height */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {showSidebar && <Sidebar role={role} />}
        <main style={{ flex: 1, minWidth: 0, padding: '24px', backgroundColor: '#F3F4F6', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}