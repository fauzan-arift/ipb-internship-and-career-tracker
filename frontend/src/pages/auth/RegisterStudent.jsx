import { useState } from 'react';
import api from '@/api/axios';

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    full_name: '', nim: '', major: '', faculty: '', 
    graduation_year: '', gpa: '', phone_number: '', 
    email: '', password: ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    const normalizedEmail = formData.email.trim().toLowerCase();
    if (!normalizedEmail.endsWith('@apps.ipb.ac.id')) {
      setStatus({ type: 'error', msg: 'Email student harus menggunakan domain @apps.ipb.ac.id.' });
      return;
    }

    setIsLoading(true);
    
    try {
      // transform specific fields
      const payload = {
        ...formData,
        email: normalizedEmail,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
      };
      
      const res = await api.post('/auth/register/student', payload);
      setStatus({ type: 'success', msg: res.data.message || 'Registrasi berhasil! Cek email untuk verifikasi.' });
      setFormData({ full_name: '', nim: '', major: '', faculty: '', graduation_year: '', gpa: '', phone_number: '', email: '', password: '' });
    } catch (err) {
      // Backend FastAPI validation errors are usually in err.response.data.detail array or string
      let errMsg = 'Gagal Registrasi';
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

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Registrasi Mahasiswa</h2>
      <form onSubmit={handleSubmit}>
        {status.msg && (
          <div className={`p-3 rounded text-sm ${status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {status.msg}
          </div>
        )}
        
        <div><label>Nama Lengkap</label><input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required /></div>
        <div><label>NIM (contoh: G6401231040)</label><input type="text" name="nim" value={formData.nim} onChange={handleChange} required /></div>
        <div><label>Mayor/Program Studi</label><input type="text" name="major" value={formData.major} onChange={handleChange} required /></div>
        <div><label>Fakultas</label><input type="text" name="faculty" value={formData.faculty} onChange={handleChange} /></div>
        
        <div className="flex space-x-2">
          <div className="w-1/2"><label>Tahun Lulus</label><input type="number" name="graduation_year" value={formData.graduation_year} onChange={handleChange} /></div>
          <div className="w-1/2"><label>IPK</label><input type="number" step="0.01" name="gpa" value={formData.gpa} onChange={handleChange} /></div>
        </div>
        
        <div><label>Nomor HP</label><input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} /></div>
        <div>
          <label>Email IPB</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            pattern=".+@apps\.ipb\.ac\.id$"
            title="Gunakan email dengan domain @apps.ipb.ac.id"
            required
          />
        </div>
        <div><label>Password</label><input type="password" name="password" minLength={8} value={formData.password} onChange={handleChange} required /></div>
        
        <button type="submit" disabled={isLoading} className="btn-primary mt-4">
          {isLoading ? 'Sedang Mendaftar...' : 'Daftar Mahasiswa'}
        </button>
      </form>
    </div>
  );
};

export default RegisterStudent;
