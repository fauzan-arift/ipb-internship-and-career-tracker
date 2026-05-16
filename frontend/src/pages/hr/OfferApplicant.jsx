import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import Button from '@/components/atoms/Button';
import OfferBreadcrumb from '@/components/molecules/OfferBreadcrumb';
import CandidateInfo from '@/components/molecules/CandidateInfo';
import OfferFormInput from '@/components/molecules/OfferFormInput';
import OfferFileUpload from '@/components/molecules/OfferFileUpload';
import { useHrApplication } from '@/hooks/useHrApplication';

export default function OfferApplicant() {
  const { application_id } = useParams();
  const navigate = useNavigate();
  const { application, loading, submitting, usingDummy, createOffer, uploadFile } = useHrApplication(application_id);

  const [formData, setFormData] = useState({
    offerDate: '',
    duration: '',
    pocketMoney: '',
    acceptBy: '',
    message: '',
    file: null,
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleFileSelect = (file) => {
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleFileRemove = () => {
    setFormData((prev) => ({ ...prev, file: null }));
  };

  const student = application?.student || {};
  const candidate = {
    name: student.full_name || 'Nama tidak diketahui',
    major: student.major || 'Jurusan tidak diketahui',
    university: 'IPB University',
    appliedPosition: application?.position || 'Posisi tidak diketahui',
  };

  const initials = candidate.name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const validateForm = () => {
    const errors = [];
    if (!formData.offerDate) errors.push('Tanggal Penawaran');
    if (!formData.duration.trim()) errors.push('Durasi Posisi');
    if (!formData.pocketMoney.trim()) errors.push('Uang Saku / Kompensasi');
    if (!formData.acceptBy) errors.push('Tenggat Waktu Offering');
    if (!formData.message.trim()) errors.push('Detail / Pesan Penawaran');
    if (!formData.file) errors.push('Dokumen');

    if (errors.length > 0) {
      alert(`Harap isi semua field berikut:\n\n- ${errors.join('\n- ')}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!application) return;

    try {
      let offeringFileId = null;
      if (formData.file) {
        const uploadResult = await uploadFile(formData.file);
        offeringFileId = uploadResult.id;
      }

      const payload = {
        offer_date: formData.offerDate,
        expiry_date: formData.acceptBy,
        duration: formData.duration,
        compensation: formData.pocketMoney,
        offer_detail: formData.message,
        offering_file_id: offeringFileId,
      };

      await createOffer(payload);
      alert('Penawaran magang berhasil dikirim!');
      navigate('/hr/applicants');
    } catch (err) {
      console.error('Failed to send offer:', err);
      alert('Gagal mengirim penawaran: ' + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Memuat data...
      </div>
    );
  }

  if (usingDummy) {
    console.info('Menggunakan data dummy untuk aplikasi ini (API belum tersedia).');
  }

  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <OfferBreadcrumb applicantId={application_id} />
      
      <CandidateInfo 
        name={candidate.name} 
        major={candidate.major} 
        initials={initials} 
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <FileText size={18} className="text-gray-700" />
          <h2 className="text-base font-bold text-gray-900">Detail Penawaran</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 w-full" style={{ width: '100%', maxWidth: '100%' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5 w-full">
            <OfferFormInput
              label="Tanggal Penawaran"
              type="date"
              value={formData.offerDate}
              onChange={handleChange('offerDate')}
              placeholder="Input tanggal"
            />
            <OfferFormInput
              label="Durasi Posisi"
              type="text"
              value={formData.duration}
              onChange={handleChange('duration')}
              placeholder="Input waktu"
            />
            <OfferFormInput
              label="Uang Saku / Kompensasi"
              type="text"
              value={formData.pocketMoney}
              onChange={handleChange('pocketMoney')}
              placeholder="Input nominal"
            />
            <OfferFormInput
              label="Tenggat Waktu Offering"
              type="date"
              value={formData.acceptBy}
              onChange={handleChange('acceptBy')}
              placeholder="Input tanggal"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">Detail / Pesan Penawaran</label>
            <textarea
              value={formData.message}
              onChange={handleChange('message')}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-colors bg-white resize-y min-h-[100px]"
              placeholder="Masukkan detail penawaran magang seperti ruang lingkup kerja, fasilitas, uang saku (jika ada)/ pesan yang ingin disampaikan dari perusahaan kepada kandidat..."
            />
          </div>

          <div>
            <div className="mb-2">
              <div className="text-sm font-semibold text-gray-900 mb-1">Dokumen</div>
              <div className="text-sm text-gray-500">
                Unggah Kurikulum Vitae (CV) terbaru Anda.
              </div>
            </div>
            <OfferFileUpload
              file={formData.file}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
            />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => navigate('/hr/applicants')}>
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Mengirim...' : 'Kirim Penawaran'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}