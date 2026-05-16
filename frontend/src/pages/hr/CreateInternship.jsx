import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, FileText } from 'lucide-react';
import hrService from '@/services/hrService';
import useToast from '@/hooks/useToast';
import Toast from '@/components/atoms/Toast';
import TextInput from '@/components/atoms/TextInput';
import TextArea from '@/components/atoms/TextArea';
import SelectInput from '@/components/atoms/SelectInput';
import FormSectionCard from '@/components/organisms/FormSectionCard';
import Breadcrumb from '@/components/molecules/Breadcrumb';
import FormActionBar from '@/components/molecules/FormActionBar';
import FormField from '@/components/molecules/FormField';
import DateRangePicker from '@/components/atoms/DateRangePicker';
import DatePicker from '@/components/atoms/DatePicker';

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_GAJI_OPTIONS = [
  { value: 'Paid', label: 'Paid Internship' },
  { value: 'Unpaid', label: 'Unpaid Internship' },
];

const STATUS_PELAKSANAAN_OPTIONS = [
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'WFO', label: 'WFO (Work From Office)' },
  { value: 'WFA', label: 'WFA (Work From Anywhere)' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

function CreateInternship() {
  const navigate = useNavigate();

  const [posisi, setPosisi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [persyaratan, setPersyaratan] = useState('');
  const [benefit, setBenefit] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [industri, setIndustri] = useState('');
  const [waktuMagang, setWaktuMagang] = useState({});
  const [kuota, setKuota] = useState('');
  const [statusGaji, setStatusGaji] = useState('');
  const [statusPelaksanaan, setStatusPelaksanaan] = useState('');
  const [tanggalDitutup, setTanggalDitutup] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  function validate() {
    const newErrors = {};
    if (!posisi) newErrors.posisi = 'Posisi wajib diisi';
    if (!deskripsi) newErrors.deskripsi = 'Deskripsi wajib diisi';
    if (!persyaratan) newErrors.persyaratan = 'Persyaratan wajib diisi';
    if (!benefit) newErrors.benefit = 'Benefit wajib diisi';
    if (!lokasi) newErrors.lokasi = 'Lokasi wajib diisi';
    if (!industri) newErrors.industri = 'Industri wajib diisi';
    if (!waktuMagang.from || !waktuMagang.to) newErrors.waktuMagang = 'Waktu magang wajib diisi';
    if (!kuota) newErrors.kuota = 'Kuota wajib diisi';
    if (!statusGaji) newErrors.statusGaji = 'Status gaji wajib dipilih';
    if (!statusPelaksanaan) newErrors.statusPelaksanaan = 'Status pelaksanaan wajib dipilih';
    if (!tanggalDitutup) newErrors.tanggalDitutup = 'Tanggal ditutup wajib diisi';
    return newErrors;
  }

  const toDateString = (d) => {
    if (!d) return undefined;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  async function onSubmitHandler() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    const payload = {
      title: posisi,
      description: deskripsi,
      requirement: persyaratan,
      benefit: benefit,
      location: lokasi,
      industry: industri,
      start_date: toDateString(waktuMagang.from),
      end_date: toDateString(waktuMagang.to),
      quota: Number(kuota),
      payment_status: statusGaji,
      work_status: statusPelaksanaan,
      close_date: toDateString(tanggalDitutup),
    };

    try {
      await hrService.createInternship(payload);
      showToast('Lowongan berhasil dibuat!', 'success');
      setTimeout(() => navigate('/hr/dashboard'), 1500);
    } catch (err) {
      const detail = err.response?.data?.detail;
      const errorMessage = Array.isArray(detail)
        ? detail.map((d) => `${d.loc[d.loc.length - 1]}: ${d.msg}`).join(', ')
        : (detail || 'Gagal membuat lowongan. Coba lagi.');
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <Breadcrumb
          items={[
            { label: 'Kelola Lowongan', href: '/hr/dashboard' },
            { label: 'Buat Lowongan Baru' },
          ]}
        />
      </div>

      <FormSectionCard title="Informasi Umum" icon={<FileText size={18} />}>
        <FormField label="Posisi yang Ditawarkan" error={errors.posisi}>
          <TextInput
            value={posisi}
            onChange={(e) => setPosisi(e.target.value)}
            placeholder="Contoh: UI/UX Designer"
          />
        </FormField>
        <FormField label="Deskripsi Pekerjaan" error={errors.deskripsi}>
          <TextArea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            placeholder="Jelaskan peran dan tanggung jawab..."
            rows={3}
          />
        </FormField>
        <FormField label="Persyaratan" error={errors.persyaratan}>
          <TextArea
            value={persyaratan}
            onChange={(e) => setPersyaratan(e.target.value)}
            placeholder="Persyaratan..."
            rows={3}
          />
        </FormField>
        <FormField label="Benefit" error={errors.benefit}>
          <TextArea
            value={benefit}
            onChange={(e) => setBenefit(e.target.value)}
            placeholder="Sebutkan benefit yang didapatkan kandidat..."
            rows={3}
          />
        </FormField>
      </FormSectionCard>

      <FormSectionCard title="Detail Lowongan" icon={<FileText size={18} />}>
        <FormField label="Lokasi" error={errors.lokasi}>
          <TextInput
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            placeholder="Alamat perusahaan..."
          />
        </FormField>
        <FormField label="Industri" error={errors.industri}>
          <TextInput
            value={industri}
            onChange={(e) => setIndustri(e.target.value)}
            placeholder="Bidang industri..."
          />
        </FormField>
        <FormField label="Waktu Mulai Magang dan Akhir Magang" error={errors.waktuMagang}>
          <DateRangePicker
            placeholder="Pilih waktu"
            value={waktuMagang}
            onChange={setWaktuMagang}
          />
        </FormField>
        <FormField label="Kuota" error={errors.kuota}>
          <input
            type="number"
            value={kuota}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || (/^\d+$/.test(val) && parseInt(val) >= 1)) {
                setKuota(val);
              }
            }}
            onKeyDown={(e) => {
              if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder="Jumlah kuota..."
            min="1"
            step="1"
            className="w-full px-4 py-3.5 rounded-lg border border-[#CBD0E0] text-base outline-none focus:border-[#4D44B5] focus:ring-1 focus:ring-[#4D44B5] transition-colors bg-white text-black"
          />
        </FormField>
        <FormField label="Status Gaji" error={errors.statusGaji}>
          <SelectInput
            value={statusGaji}
            onChange={(e) => setStatusGaji(e.target.value)}
            options={STATUS_GAJI_OPTIONS}
            placeholder="Pilih status gaji..."
          />
        </FormField>
        <FormField label="Status Pelaksanaan" error={errors.statusPelaksanaan}>
          <SelectInput
            value={statusPelaksanaan}
            onChange={(e) => setStatusPelaksanaan(e.target.value)}
            options={STATUS_PELAKSANAAN_OPTIONS}
            placeholder="Pilih status pelaksanaan..."
          />
        </FormField>
        <FormField label="Tanggal Lowongan Ditutup" error={errors.tanggalDitutup}>
          <DatePicker
            placeholder="dd/mm/yyyy"
            value={tanggalDitutup}
            onChange={setTanggalDitutup}
          />
        </FormField>
      </FormSectionCard>

      <FormActionBar
        onCancel={() => navigate('/hr/dashboard')}
        onSubmit={onSubmitHandler}
        cancelLabel="Batal"
        submitLabel={isLoading ? 'Menyimpan...' : 'Simpan Lowongan'}
        submitIcon={<Save size={15} />}
        disabled={isLoading}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default CreateInternship;