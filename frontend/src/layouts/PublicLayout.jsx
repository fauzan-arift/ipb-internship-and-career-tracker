import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PublicLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden', backgroundColor: '#EEF0F8' }}>
      <Header variant="app" />
      <main
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}