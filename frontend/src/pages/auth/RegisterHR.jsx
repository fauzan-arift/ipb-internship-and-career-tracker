import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import Navbar from '@/components/organisms/Navbar';
import PageFooter from '@/components/organisms/PageFooter';
import Button from '@/components/atoms/Button';
import TextInput from '@/components/atoms/TextInput';
import PasswordInput from '@/components/atoms/PasswordInput';

const RegisterHR = () => {
  const [formData, setFormData] = useState({
    full_name: '', position: '', email: '', password: '',
    company_name: '', address: '', industry: '',
    website: '', description: '', company_email: ''
  });
  const [npwpFile, setNpwpFile] = useState(null);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setNpwpFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) payload.append(key, formData[key]);
      });
      if (npwpFile) payload.append('npwp_file', npwpFile);

      const res = await api.post('/auth/register/hr', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setStatus({ type: 'success', msg: res.data.message || 'Registrasi berhasil! Menunggu verifikasi admin.' });
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      let errMsg = 'Gagal registrasi. Coba lagi.';
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          errMsg = err.response.data.detail.map(d => `${d.loc.slice(-1)}: ${d.msg}`).join(', ');
        } else {
          errMsg = err.response.data.detail;
        }
      }
      setStatus({ type: 'error', msg: errMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const sectionTitle = {
    fontSize: '15px', fontWeight: '600', color: '#3D3FA8',
    fontFamily: 'Inter, sans-serif', borderBottom: '1px solid #E5E7EB',
    paddingBottom: '8px', margin: '8px 0 4px 0',
  };

  const textareaStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: '1.5px solid #CBD0E0', fontSize: '14px',
    fontFamily: 'Inter, sans-serif', color: '#1A1A2E',
    outline: 'none', resize: 'vertical', boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#EEF0F8', display: 'flex', flexDirection: 'column' }}>
      <Navbar variant="auth" />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '40px', width: '100%', maxWidth: '600px', boxSizing: 'border-box' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#3D3FA8', fontFamily: 'Inter, sans-serif', margin: '0 0 24px 0', textAlign: 'center' }}>
            Registrasi HR & Perusahaan
          </h1>

          {status.msg && (
            <div style={{
              backgroundColor: status.type === 'error' ? '#FEE2E2' : '#D1FAE5',
              border: `1px solid ${status.type === 'error' ? '#FECACA' : '#6EE7B7'}`,
              borderRadius: '8px', padding: '10px 14px',
              color: status.type === 'error' ? '#DC2626' : '#065F46',
              fontSize: '13px', fontFamily: 'Inter, sans-serif', marginBottom: '16px'
            }}>
              {status.msg}
            </div>
          )}

          <div onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Akun HR */}
            <p style={sectionTitle}>Data Akun HR</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <TextInput label="Nama Lengkap *" placeholder="Nama lengkap"
                  value={formData.full_name} onChange={handleChange} name="full_name" required />
              </div>
              <div style={{ flex: 1 }}>
                <TextInput label="Jabatan" placeholder="HR Manager"
                  value={formData.position} onChange={handleChange} name="position" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <TextInput label="Email *" type="email" placeholder="email@perusahaan.com"
                  value={formData.email} onChange={handleChange} name="email" required />
              </div>
              <div style={{ flex: 1 }}>
                <PasswordInput label="Password * (min. 8 karakter)" placeholder="Minimal 8 karakter"
                  value={formData.password} onChange={handleChange} name="password"
                  minLength={8} required />
              </div>
            </div>

            {/* Perusahaan */}
            <p style={sectionTitle}>Data Perusahaan</p>
            <TextInput label="Nama Perusahaan *" placeholder="PT. Nama Perusahaan"
              value={formData.company_name} onChange={handleChange} name="company_name" required />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
                Alamat Perusahaan
              </label>
              <textarea style={textareaStyle} name="address" value={formData.address}
                onChange={handleChange} rows={2} placeholder="Jl. Contoh No. 1, Jakarta" />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <TextInput label="Industri" placeholder="Teknologi"
                  value={formData.industry} onChange={handleChange} name="industry" />
              </div>
              <div style={{ flex: 1 }}>
                <TextInput label="Website" placeholder="https://perusahaan.com"
                  value={formData.website} onChange={handleChange} name="website" />
              </div>
            </div>

            <TextInput label="Email Perusahaan" type="email" placeholder="info@perusahaan.com"
              value={formData.company_email} onChange={handleChange} name="company_email" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
                Deskripsi Perusahaan
              </label>
              <textarea style={textareaStyle} name="description" value={formData.description}
                onChange={handleChange} rows={3} placeholder="Deskripsi singkat tentang perusahaan..." />
            </div>

            {/* Dokumen */}
            <p style={sectionTitle}>Dokumen Legalitas</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
                Upload NPWP * (PDF/JPG/PNG - Max 5MB)
              </label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} required
                style={{ fontSize: '13px', fontFamily: 'Inter, sans-serif' }} />
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={isLoading} style={{ marginTop: '8px' }}>
              {isLoading ? 'Mendaftarkan...' : 'Daftar HR & Perusahaan'}
            </Button>

            <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', margin: 0 }}>
              Sudah punya akun?{' '}
              <span onClick={() => navigate('/login')} style={{ color: '#3D3FA8', cursor: 'pointer', fontWeight: '500' }}>
                Login di sini
              </span>
            </p>
          </div>
        </div>
      </div>
      <PageFooter />
    </div>
  );
};

export default RegisterHR;
