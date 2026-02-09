import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'student': return 'role-badge role-student'
      case 'company': return 'role-badge role-company'
      default: return 'role-badge'
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome, {user?.full_name}</p>
        </div>
        <div className="user-info">
          <span className={getRoleBadgeClass(user?.role)}>{user?.role}</span>
          <button onClick={handleLogout} className="btn btn-logout">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content" style={{ background: 'white', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h2>User Information</h2>
        <div style={{ marginTop: '20px' }}>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          
          {user?.role === 'student' && (
            <>
              <p><strong>NIM:</strong> {user?.nim}</p>
              <p><strong>Major:</strong> {user?.major}</p>
            </>
          )}
          
          {user?.role === 'company' && (
            <>
              <p><strong>Company:</strong> {user?.company_name}</p>
              <p><strong>Address:</strong> {user?.company_address}</p>
              <p><strong>Phone:</strong> {user?.company_phone}</p>
            </>
          )}
        </div>

        <div style={{ marginTop: '40px', padding: '20px', background: '#f5f5f5', borderRadius: '4px' }}>
          <h3>Next Steps</h3>
          <p style={{ marginTop: '10px' }}>
            This is the initial setup. You can now develop features like:
          </p>
          <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
            <li>Internship opportunity management</li>
            <li>Application tracking system</li>
            <li>MBKM program management</li>
            <li>Report submission and deadlines</li>
            <li>Company job posting dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
