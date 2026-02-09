import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Redirect if not admin
  if (user?.role !== 'admin') {
    navigate('/admin');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.full_name}</p>
        </div>
        <div className="user-info">
          <span className="role-badge role-admin">{user?.role}</span>
          <button onClick={handleLogout} className="btn btn-logout">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content" style={{ background: 'white', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h2>System Overview</h2>
        <div style={{ marginTop: '20px' }}>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> Administrator</p>
          <p><strong>Status:</strong> <span style={{ color: 'green' }}>Active</span></p>
        </div>

        <div style={{ 
          marginTop: '40px', 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px' 
        }}>
          <div style={{ padding: '20px', background: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '8px' }}>
            <h3 style={{ margin: 0, color: '#0c4a6e' }}>Total Students</h3>
            <p style={{ fontSize: '32px', margin: '10px 0 0 0', fontWeight: 'bold', color: '#0369a1' }}>0</p>
          </div>
          
          <div style={{ padding: '20px', background: '#f0fdf4', border: '1px solid #22c55e', borderRadius: '8px' }}>
            <h3 style={{ margin: 0, color: '#14532d' }}>Total Companies</h3>
            <p style={{ fontSize: '32px', margin: '10px 0 0 0', fontWeight: 'bold', color: '#16a34a' }}>0</p>
          </div>
          
          <div style={{ padding: '20px', background: '#faf5ff', border: '1px solid #a855f7', borderRadius: '8px' }}>
            <h3 style={{ margin: 0, color: '#581c87' }}>Active Internships</h3>
            <p style={{ fontSize: '32px', margin: '10px 0 0 0', fontWeight: 'bold', color: '#7c3aed' }}>0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
