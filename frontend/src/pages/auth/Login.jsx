import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import Navbar from '@/components/organisms/Navbar';
import PageFooter from '@/components/organisms/PageFooter';
import TextInput from '@/components/atoms/TextInput';
import PasswordInput from '@/components/atoms/PasswordInput';
import Button from '@/components/atoms/Button';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function validate() {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!password) {
      newErrors.password = 'Password wajib diisi';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    return newErrors;
  }

  function onSubmitHandler(event) {
    event.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (email === 'admin@ipb.ac.id') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#EEF0F8', display: 'flex', flexDirection: 'column' }}>
      <Navbar variant="auth" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #CBD0E0',
            padding: '40px',
            width: '100%',
            maxWidth: '440px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
            <div
              style={{
                backgroundColor: '#EEF0FF',
                borderRadius: '10px',
                padding: '12px',
                color: '#3D3FA8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Briefcase size={24} />
            </div>
            <h1
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#3D3FA8',
                fontFamily: 'Inter, sans-serif',
                margin: 0,
              }}
            >
              IPB Internship Portal
            </h1>
          </div>

          <form onSubmit={onSubmitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextInput
              label="Email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <PasswordInput
                label="Password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              <div style={{ textAlign: 'right' }}>
                {/* <Link
                  to="/forgot-password"
                  style={{
                    fontSize: '13px',
                    color: '#3D3FA8',
                    fontFamily: 'Inter, sans-serif',
                    textDecoration: 'none',
                    fontWeight: '500',
                  }}
                >
                  Lupa password?
                </Link> */}
              </div>
            </div>

            <Button type="submit" variant="primary" fullWidth>
              Login
            </Button>
          </form>

          <div
            style={{
              margin: '24px 0',
              borderTop: '1px solid #CBD0E0',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              Belum punya akun? Daftar sebagai
            </span>
            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <Button variant="primary" fullWidth onClick={() => navigate('/register/mahasiswa')}>
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