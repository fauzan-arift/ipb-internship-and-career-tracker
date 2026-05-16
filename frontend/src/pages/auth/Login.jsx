import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/organisms/Navbar';
import logoIPB from '@/assets/logo-ipb.png';
import PageFooter from '@/components/organisms/PageFooter';
import TextInput from '@/components/atoms/TextInput';
import PasswordInput from '@/components/atoms/PasswordInput';
import FormField from '@/components/molecules/FormField';
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
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setApiError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data.data.access_token;

      login(token);

      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      const role = payload?.role;

      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'HR') navigate('/hr/dashboard');
      else if (role === 'STUDENT') navigate('/internship');
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
            <img src={logoIPB} alt="IPB Logo" style={{ height: '64px', width: 'auto' }} />
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#3D3FA8', fontFamily: 'Inter, sans-serif', margin: 0 }}>
              IPB Internship Portal
            </h1>
          </div>

          <form onSubmit={onSubmitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <FormField label="Email" error={errors.email}>
              <TextInput
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>

            <FormField label="Password" error={errors.password}>
              <PasswordInput
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormField>

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