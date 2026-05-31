import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import Button from '@/components/atoms/Button';
import TextInput from '@/components/atoms/TextInput';
import PasswordInput from '@/components/atoms/PasswordInput';
import SelectInput from '@/components/atoms/SelectInput';
import FormField from '@/components/molecules/FormField';
import { IPB_FACULTIES } from '@/constants/ipbData';

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    full_name: '', nim: '', major: '', faculty: '',
    graduation_year: '', gpa: '', phone_number: '',
    email: '', password: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFacultyChange = (e) => {
    setFormData({ ...formData, faculty: e.target.value, major: '' });
  };

  const facultyOptions = IPB_FACULTIES.map(f => ({ label: f.name, value: f.name }));
  const selectedFaculty = IPB_FACULTIES.find(f => f.name === formData.faculty);
  const majorOptions = selectedFaculty
    ? selectedFaculty.majors.map(m => ({ label: m, value: m }))
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    const normalizedEmail = formData.email.trim().toLowerCase();
    if (!normalizedEmail.endsWith('@apps.ipb.ac.id')) {
      setStatus({ type: 'error', msg: 'Email student harus menggunakan domain @apps.ipb.ac.id.' });
      return;
    }

    let normalizedGpa = null;
    if (formData.gpa !== '' && formData.gpa !== null && formData.gpa !== undefined) {
      const parsed = parseFloat(String(formData.gpa).replace(',', '.'));
      if (isNaN(parsed) || parsed < 0.0 || parsed > 4.0) {
        setStatus({ type: 'error', msg: 'IPK harus berupa angka desimal antara 0.00 dan 4.00' });
        return;
      }
      normalizedGpa = parsed;
    }

    let normalizedGradYear = null;
    if (formData.graduation_year !== '' && formData.graduation_year !== null && formData.graduation_year !== undefined) {
      const parsed = parseInt(formData.graduation_year, 10);
      if (isNaN(parsed) || parsed < 2000 || parsed > 2100) {
        setStatus({ type: 'error', msg: 'Tahun Lulus harus berupa angka tahun antara 2000 dan 2100' });
        return;
      }
      normalizedGradYear = parsed;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        email: normalizedEmail,
        graduation_year: normalizedGradYear,
        gpa: normalizedGpa,
        faculty: formData.faculty || null,
        phone_number: formData.phone_number || null,
      };

      const res = await api.post('/auth/register/student', payload);
      setStatus({ type: 'success', msg: res.data.message || 'Registrasi berhasil! Cek email untuk verifikasi.' });
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
        width: '100%', maxWidth: '520px', boxSizing: 'border-box'
      }}>
        <h1 className="m-0 mb-6" style={{ fontSize: '22px', fontWeight: '700', color: '#3D3FA8', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
          Registrasi Mahasiswa
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
          <p className="mt-2 mb-2 pb-2" style={sectionTitle}>Data Pribadi</p>

          <FormField label="Nama Lengkap *">
            <TextInput placeholder="Nama lengkap sesuai KTP"
              value={formData.full_name} onChange={handleChange} name="full_name" required />
          </FormField>

          <FormField label="NIM * (contoh: G6401231040)">
            <TextInput placeholder="G6401231040"
              value={formData.nim} onChange={handleChange} name="nim" required />
          </FormField>

          <FormField label="Fakultas *">
            <SelectInput
              placeholder="Pilih Fakultas"
              value={formData.faculty}
              onChange={handleFacultyChange}
              options={facultyOptions}
            />
          </FormField>

          <FormField label="Program Studi *">
            <SelectInput
              placeholder={formData.faculty ? 'Pilih Program Studi' : 'Pilih Fakultas terlebih dahulu'}
              value={formData.major}
              onChange={handleChange}
              name="major"
              options={majorOptions}
              disabled={!formData.faculty}
            />
          </FormField>

          <div className="gap-4" style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <FormField label="Tahun Lulus">
                <TextInput placeholder="2026" type="number"
                  value={formData.graduation_year} onChange={handleChange}
                  name="graduation_year" min="2000" max="2100" />
              </FormField>
            </div>
            <div style={{ flex: 1 }}>
              <FormField label="IPK">
                <TextInput placeholder="3.50" type="number"
                  value={formData.gpa} onChange={handleChange}
                  name="gpa" min="0" max="4" step="0.01" />
              </FormField>
            </div>
          </div>

          <FormField label="Nomor HP">
            <TextInput placeholder="08123456789"
              value={formData.phone_number} onChange={handleChange} name="phone_number" />
          </FormField>

          <p className="mt-2 mb-2 pb-2" style={sectionTitle}>Akun</p>

          <FormField label="Email IPB * (@apps.ipb.ac.id)">
            <TextInput type="email" placeholder="nama@apps.ipb.ac.id"
              value={formData.email} onChange={handleChange} name="email" required />
          </FormField>

          <FormField label="Password * (minimal 8 karakter)">
            <PasswordInput placeholder="Minimal 8 karakter"
              value={formData.password} onChange={handleChange} name="password"
              minLength={8} required />
          </FormField>

          <Button type="submit" variant="primary" fullWidth disabled={isLoading} className="mt-2">
            {isLoading ? 'Mendaftarkan...' : 'Daftar Mahasiswa'}
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

export default RegisterStudent;