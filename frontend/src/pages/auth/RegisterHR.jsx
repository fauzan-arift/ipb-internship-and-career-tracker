import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import Button from '@/components/atoms/Button';
import TextInput from '@/components/atoms/TextInput';
import PasswordInput from '@/components/atoms/PasswordInput';
import TextArea from '@/components/atoms/TextArea';
import FormField from '@/components/molecules/FormField';
import UploadZone from '@/components/atoms/UploadZone';
import UploadedFileRow from '@/components/molecules/UploadedFileRow';

const RegisterHR = () => {
  const [formData, setFormData] = useState({
    full_name: '', phone_number: '', position: '', email: '', password: '',
    company_name: '', address: '', industry: '',
    website: '', description: '', company_email: ''
  });
  const [npwpFile, setNpwpFile] = useState(null);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileSelect = (file) => {
    if (file) setNpwpFile(file);
  };

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
  };

  return (
    <div className="p-0" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="p-6" style={{
        backgroundColor: '#FFFFFF', borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        width: '100%', maxWidth: '600px', boxSizing: 'border-box'
      }}>
        <h1 className="m-0 mb-6" style={{ fontSize: '22px', fontWeight: '700', color: '#3D3FA8', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
          Registrasi HR & Perusahaan
        </h1>

        {status.msg && (
          <div className="p-4 mb-4" style={{
            backgroundColor: status.type === 'error' ? '#FEE2E2' : '#D1FAE5',
            border: `1px solid ${status.type === 'error' ? '#FECACA' : '#6EE7B7'}`,
            borderRadius: '8px',
            color: status.type === 'error' ? '#DC2626' : '#065F46',
            fontSize: '13px', fontFamily: 'Inter, sans-serif'
          }}>
            {status.msg}
          </div>
        )}

        <form
            onSubmit={handleSubmit} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              backgroundColor: 'transparent',
              borderRadius: '0',
              padding: '0',
              boxShadow: 'none',
              width: '100%',
              maxWidth: '100%',
            }}
          >
          <p className="mt-2 mb-2 pb-2" style={sectionTitle}>Data Akun HR</p>

          {/* Baris 1: Nama - No. Telepon */}
          <div className="gap-4" style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <FormField label="Nama Lengkap *">
                <TextInput placeholder="Nama lengkap"
                  value={formData.full_name} onChange={handleChange} name="full_name" required />
              </FormField>
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="No. Telepon (WhatsApp)">
                <TextInput placeholder="08123456789" type="tel"
                  value={formData.phone_number} onChange={handleChange} name="phone_number" />
              </FormField>
            </div>
          </div>

          {/* Baris 2: Jabatan - Email */}
          <div className="gap-4" style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <FormField label="Jabatan">
                <TextInput placeholder="HR Manager"
                  value={formData.position} onChange={handleChange} name="position" />
              </FormField>
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="Email *">
                <TextInput type="email" placeholder="email@perusahaan.com"
                  value={formData.email} onChange={handleChange} name="email" required />
              </FormField>
            </div>
          </div>

          {/* Baris 3: Password */}
          <FormField label="Password * (min. 8 karakter)">
            <PasswordInput placeholder="Minimal 8 karakter"
              value={formData.password} onChange={handleChange} name="password"
              minLength={8} required />
          </FormField>

          <p className="mt-2 mb-2 pb-2" style={sectionTitle}>Data Perusahaan</p>

          <FormField label="Nama Perusahaan *">
            <TextInput placeholder="PT. Nama Perusahaan"
              value={formData.company_name} onChange={handleChange} name="company_name" required />
          </FormField>

          <FormField label="Alamat Perusahaan">
            <TextArea placeholder="Jl. Contoh No. 1, Jakarta"
              value={formData.address} onChange={handleChange} name="address" rows={2} />
          </FormField>

          <div className="gap-4" style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <FormField label="Industri">
                <TextInput placeholder="Teknologi"
                  value={formData.industry} onChange={handleChange} name="industry" />
              </FormField>
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="Website">
                <TextInput placeholder="https://perusahaan.com"
                  value={formData.website} onChange={handleChange} name="website" />
              </FormField>
            </div>
          </div>

          <FormField label="Email Perusahaan">
            <TextInput type="email" placeholder="info@perusahaan.com"
              value={formData.company_email} onChange={handleChange} name="company_email" />
          </FormField>

          <FormField label="Deskripsi Perusahaan">
            <TextArea placeholder="Deskripsi singkat tentang perusahaan..."
              value={formData.description} onChange={handleChange} name="description" rows={3} />
          </FormField>

          <p className="mt-2 mb-2 pb-2" style={sectionTitle}>Dokumen Legalitas</p>

          <FormField label="Upload NPWP * (PDF/JPG/PNG - Max 5MB)">
            <UploadZone
              accept=".pdf,.jpg,.jpeg,.png"
              file={npwpFile}
              hint="PDF/JPG/PNG - Max 5MB"
              onChange={(file) => {
                setNpwpFile(file);
                if (!file && fileInputRef.current) fileInputRef.current.value = '';
              }}
            />
          </FormField>

          <Button type="submit" variant="primary" fullWidth disabled={isLoading} className="mt-2">
            {isLoading ? 'Mendaftarkan...' : 'Daftar HR & Perusahaan'}
          </Button>

          <p className="m-0" style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            Sudah punya akun?{' '}
            <span onClick={() => navigate('/login')} style={{ color: '#3D3FA8', cursor: 'pointer', fontWeight: '500' }}>
              Login di sini
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterHR;