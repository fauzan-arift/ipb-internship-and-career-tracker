import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PublicLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header variant="auth" />
      <main style={{ flex: 1, padding: '24px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}