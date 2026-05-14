import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import Navbar from '@/components/organisms/Navbar';
import PageFooter from '@/components/organisms/PageFooter';
import TextInput from '@/components/atoms/TextInput';
import PasswordInput from '@/components/atoms/PasswordInput';
import Button from '@/components/atoms/Button';
import api from '@/api/axios';
import { useAuth } from '@/hooks/useAuth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  function validate() {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) newErrors.email = 'Email wajib diisi';
    else if (!emailRegex.test(email)) newErrors.email = 'Format email tidak valid';
    if (!password) newErrors.password = 'Password wajib diisi';
    else if (password.length < 6) newErrors.password = 'Password minimal 6 karakter';
    return newErrors;
  }

  async function onSubmitHandler(event) {
    event.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setErrors({});
    setApiError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.data.access_token;

      // Update auth context (ini juga save ke localStorage)
      login(token);

      // Decode role dari JWT payload
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      const role = payload?.role;

      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'HR') navigate('/');
      else navigate('/');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Terjadi kesalahan. Coba lagi.';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#EEF0F8', display: 'flex', flexDirection: 'column' }}>
      <Navbar variant="auth" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '40px', width: '100%', maxWidth: '440px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
            <div style={{ backgroundColor: '#EEF0FF', borderRadius: '10px', padding: '12px', color: '#3D3FA8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={24} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#3D3FA8', fontFamily: 'Inter, sans-serif', margin: 0 }}>
              IPB Internship Portal
            </h1>
          </div>

          <form onSubmit={onSubmitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextInput label="Email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
            <PasswordInput label="Password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />

            {apiError && (
              <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px', color: '#DC2626', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                {apiError}
              </div>
            )}

            <Button type="submit" variant="primary" fullWidth disabled={loading}>
              {loading ? 'Memproses...' : 'Login'}
            </Button>
          </form>

          <div style={{ margin: '24px 0', borderTop: '1px solid #CBD0E0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              Belum punya akun? Daftar sebagai
            </span>
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              {/* FIXED: /register/student bukan /register/mahasiswa */}
              <Button variant="primary" fullWidth onClick={() => navigate('/register/student')}>
                Mahasiswa
              </Button>
              <Button variant="primary" fullWidth onClick={() => navigate('/register/hr')}>
                HR Perusahaan
              </Button>
            </div>
          </div>
        </div>
      </div>
      <PageFooter />
    </div>
  );
}

export default Login;