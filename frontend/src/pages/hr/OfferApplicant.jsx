import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText } from 'lucide-react';
import Button from '@/components/atoms/Button';
import DatePicker from '@/components/atoms/DatePicker';
import Breadcrumb from '@/components/molecules/Breadcrumb';
import CandidateInfo from '@/components/molecules/CandidateInfo';
import OfferFormInput from '@/components/molecules/OfferFormInput';
import UploadZone from '@/components/atoms/UploadZone';
import { useHrApplication } from '@/hooks/useHrApplication';
import { format } from 'date-fns';

export default function OfferApplicant() {
  const { application_id } = useParams();
  const navigate = useNavigate();
  const { application, loading, submitting, usingDummy, createOffer, uploadFile } = useHrApplication(application_id);

  const [formData, setFormData] = useState({
    offerDate: new Date(),
    duration: '',
    pocketMoney: '',
    acceptBy: null,
    message: '',
    file: null,
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDateChange = (field) => (date) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
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

  const toDateString = (date) => {
    if (!date) return '';
    return format(date, 'yyyy-MM-dd');
  };

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

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFormSubmitting || submitting) return;
    if (!validateForm()) return;
    if (!application) return;

    setIsFormSubmitting(true);
    try {
      let offeringFileId = null;
      if (formData.file) {
        const uploadResult = await uploadFile(formData.file);
        offeringFileId = uploadResult.id;
      }

      const payload = {
        offer_date: toDateString(formData.offerDate),
        expiry_date: toDateString(formData.acceptBy),
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
    } finally {
      setIsFormSubmitting(false);
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
    <div className="flex flex-col gap-6 p-0 w-full">
      <Breadcrumb
        items={[
          { label: 'Daftar Pelamar', href: '/hr/applicants' },
          { label: 'Detail Pelamar', href: `/hr/applicants/${application_id}` },
          { label: 'Berikan Penawaran Magang' },
        ]}
      />

      <CandidateInfo
        name={candidate.name}
        major={candidate.major}
        initials={initials}
        photoUrl={student.photo_profile_url}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <FileText size={18} className="text-gray-700" />
          <h2 className="text-base font-bold text-gray-900">Detail Penawaran</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 w-full" style={{ width: '100%', maxWidth: '100%', padding: '0', boxShadow: 'none' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5 w-full">
            <DatePicker
              label="Tanggal Penawaran"
              placeholder="Pilih tanggal"
              value={formData.offerDate}
              onChange={handleDateChange('offerDate')}
            />
            <DatePicker
              label="Tenggat Waktu Offering"
              placeholder="Pilih tanggal"
              value={formData.acceptBy}
              onChange={handleDateChange('acceptBy')}
            />
            <OfferFormInput
              label="Durasi Posisi"
              type="text"
              value={formData.duration}
              onChange={handleChange('duration')}
              placeholder="Misal: 3 bulan, 6 bulan, dst."
            />
            <OfferFormInput
              label="Uang Saku / Kompensasi"
              type="text"
              value={formData.pocketMoney}
              onChange={handleChange('pocketMoney')}
              placeholder="Input nominal (Misal: Rp x.xxx.xxx)"
            />
            
          </div>

          <div className="flex flex-col gap-2">
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
              <div className="text-sm font-semibold text-gray-900 mb-2">Dokumen</div>
              <div className="text-sm text-gray-500">
                Unggah File Penawaran Anda (Offering Letter).
              </div>
            </div>
            <UploadZone
              accept=".pdf,.doc,.docx"
              file={formData.file}
              hint="PDF/DOC/DOCX"
              onChange={(file) => setFormData((prev) => ({ ...prev, file }))}
            />
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => navigate('/hr/applicants')}>
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={isFormSubmitting || submitting}>
              {isFormSubmitting || submitting ? 'Mengirim...' : 'Kirim Penawaran'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}