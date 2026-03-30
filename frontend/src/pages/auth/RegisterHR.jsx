import { useState } from 'react';
import api from '@/api/axios';

const RegisterHR = () => {
  const [formData, setFormData] = useState({
    full_name: '', position: '', email: '', password: '', 
    company_name: '', address: '', industry: '', 
    website: '', description: '', company_email: ''
  });
  const [npwpFile, setNpwpFile] = useState(null);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setNpwpFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', msg: '' });
    
    try {
      // Use FormData since backend expects Form(...) and UploadFile
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) payload.append(key, formData[key]);
      });
      if (npwpFile) {
        payload.append('npwp_file', npwpFile);
      }

      const res = await api.post('/auth/register/hr', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setStatus({ type: 'success', msg: res.data.message || 'Registrasi HR berhasil! Menunggu verifikasi admin.' });
      setFormData({ full_name: '', position: '', email: '', password: '', company_name: '', address: '', industry: '', website: '', description: '', company_email: '' });
      setNpwpFile(null);
    } catch (err) {
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
      <h2 className="text-2xl font-bold text-center mb-6">Registrasi HR & Perusahaan</h2>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        {status.msg && (
          <div className={`p-3 rounded text-sm ${status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {status.msg}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 text-lg font-semibold border-b pb-2 mt-4">Data Akun HR</div>
          <div><label>Nama Lengkap</label><input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required /></div>
          <div><label>Jabatan (Position)</label><input type="text" name="position" value={formData.position} onChange={handleChange} /></div>
          <div><label>Email Pribadi/Kerja</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
          <div><label>Password</label><input type="password" name="password" minLength={8} value={formData.password} onChange={handleChange} required /></div>

          <div className="col-span-2 text-lg font-semibold border-b pb-2 mt-4">Data Perusahaan</div>
          <div className="col-span-2"><label>Nama Perusahaan</label><input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required /></div>
          <div className="col-span-2"><label>Alamat Perusahaan</label><textarea name="address" value={formData.address} onChange={handleChange} rows="2" /></div>
          <div><label>Industri</label><input type="text" name="industry" value={formData.industry} onChange={handleChange} /></div>
          <div><label>Website</label><input type="text" name="website" value={formData.website} onChange={handleChange} /></div>
          <div><label>Email Perusahaan</label><input type="email" name="company_email" value={formData.company_email} onChange={handleChange} /></div>
          <div className="col-span-2"><label>Deskripsi Perusahaan</label><textarea name="description" value={formData.description} onChange={handleChange} rows="3" /></div>
          
          <div className="col-span-2 text-lg font-semibold border-b pb-2 mt-4">Dokumen Legalitas</div>
          <div className="col-span-2">
            <label>Upload NPWP (PDF/JPG/PNG - Max 5MB)</label>
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} required className="border-none !p-0 mt-2" />
          </div>
        </div>
        
        <button type="submit" disabled={isLoading} className="btn-primary mt-6">
          {isLoading ? 'Sedang Mengunggah & Mendaftar...' : 'Daftar HR & Perusahaan'}
        </button>
      </form>
    </div>
  );
};

export default RegisterHR;
