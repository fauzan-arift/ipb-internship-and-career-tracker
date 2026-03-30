import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/api/axios';

const HRDetail = () => {
  const { hr_profile_id } = useParams();
  const profileId = hr_profile_id;
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/admin/hr/profile/${profileId}`);
        if (res.data.success) {
          setDetail(res.data.data);
        }
      } catch (err) {
        setStatus({ type: 'error', msg: err.response?.data?.detail || 'Gagal memuat detail HR' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [profileId]);

  const handleApprove = async () => {
    if (!window.confirm('Yakin ingin menyetujui HR ini? Email persetujuan akan dikirim.')) return;
    setIsProcessing(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await api.post(`/admin/hr/profile/${profileId}/approve`);
      setStatus({ type: 'success', msg: res.data.message });
      setTimeout(() => navigate('/admin/pending'), 2000);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.detail || 'Gagal menyetujui' });
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt("Alasan penolakan (akan dikirim via email):");
    if (!reason || reason.trim() === "") return;
    
    setIsProcessing(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await api.post(`/admin/hr/profile/${profileId}/reject`, { reason });
      setStatus({ type: 'success', msg: res.data.message });
      setTimeout(() => navigate('/admin/pending'), 2000);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.detail || 'Gagal menolak' });
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading detail...</div>;
  if (!detail) return <div className="text-center py-10 text-red-500">{status.msg}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Detail Pendaftaran HR</h2>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">← Kembali</button>
      </div>

      {status.msg && (
        <div className={`p-4 rounded ${status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {status.msg}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold border-b pb-2 mb-4">Informasi HR (Pengguna)</h3>
          <ul className="space-y-2 text-sm">
            <li><strong>ID User:</strong> {detail.hr?.user_id || '-'}</li>
            <li><strong>ID Profil HR:</strong> {detail.hr?.hr_profile_id || detail.hr?.hr_id || '-'}</li>
            <li><strong>Nama:</strong> {detail.hr?.full_name}</li>
            <li><strong>Email:</strong> {detail.hr?.email}</li>
            <li><strong>Jabatan:</strong> {detail.hr?.position || '-'}</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold border-b pb-2 mb-4">Informasi Perusahaan</h3>
          <ul className="space-y-2 text-sm">
            <li><strong>Nama Perusahaan:</strong> {detail.company?.company_name}</li>
            <li><strong>Email:</strong> {detail.company?.company_email || '-'}</li>
            <li><strong>Industri:</strong> {detail.company?.industry || '-'}</li>
            <li><strong>Website:</strong> {detail.company?.website ? <a href={detail.company.website} target="_blank" className="text-blue-500 hover:underline">{detail.company.website}</a> : '-'}</li>
            <li><strong>Alamat:</strong> {detail.company?.address || '-'}</li>
            <li><strong>Deskripsi:</strong> {detail.company?.description || '-'}</li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">Dokumen NPWP</h3>
          <p className="text-sm text-gray-600 mb-2">Nama File: {detail.npwp_document?.file_name} ({detail.npwp_document?.file_format})</p>
          <a
            href={detail.npwp_document?.download_url} 
            target="_blank" rel="noreferrer"
            className="text-blue-600 hover:underline font-semibold text-sm inline-block mb-3"
          >
            Buka Dokumen di Tab Baru ↗
          </a>
          
          <div className="mt-2 text-center rounded bg-gray-50 flex items-center justify-center p-2 border border-gray-200" style={{ minHeight: '300px' }}>
            {(() => {
              const format = detail.npwp_document?.file_format?.toLowerCase()?.replace('.', '') || '';
              if (format === 'pdf') {
                return (
                  <iframe 
                    src={detail.npwp_document?.download_url} 
                    className="w-full h-96 border-0" 
                    title="Preview PDF NPWP"
                  />
                );
              } else if (['jpg', 'jpeg', 'png', 'webp'].includes(format)) {
                return (
                  <img 
                    src={detail.npwp_document?.download_url} 
                    alt="Preview NPWP" 
                    className="max-w-full h-auto max-h-96 object-contain"
                  />
                );
              } else {
                return (
                  <span className="text-gray-400 italic">Preview tidak tersedia untuk format {detail.npwp_document?.file_format || 'tidak diketahui'}</span>
                );
              }
            })()}
          </div>
        </div>
      </div>

      <div className="flex space-x-4 pt-4 border-t">
        {detail.hr?.status?.toLowerCase() === 'pending' ? (
          <>
            <button onClick={handleApprove} disabled={isProcessing || status.type === 'success'} className="btn-primary !w-auto bg-green-600 hover:bg-green-700">
              Setujui Pendaftaran (Approve)
            </button>
            <button onClick={handleReject} disabled={isProcessing || status.type === 'success'} className="btn-secondary !w-auto bg-red-100 text-red-700 hover:bg-red-200">
              Tolak Pendaftaran (Reject)
            </button>
          </>
        ) : (
          <div className="text-gray-500 font-semibold italic">
            HR ini sudah diproses dan berstatus: {detail.hr?.status?.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};

export default HRDetail;
