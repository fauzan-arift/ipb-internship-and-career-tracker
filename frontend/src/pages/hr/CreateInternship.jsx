import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, List, Save, FileText } from 'lucide-react';
import hrService from '@/services/hrService';
import api from '@/api/axios';
import useToast from '@/hooks/useToast';
import Toast from '@/components/atoms/Toast';
import Navbar from '@/components/organisms/Navbar';
import PageFooter from '@/components/organisms/PageFooter';
import Sidebar from '@/components/organisms/Sidebar';
import SidebarLayout from '@/components/organisms/SidebarLayout';
import FormSectionCard from '@/components/organisms/FormSectionCard';
import Breadcrumb from '@/components/molecules/Breadcrumb';
import FormActionBar from '@/components/molecules/FormActionBar';
import TextInput from '@/components/atoms/TextInput';
import TextArea from '@/components/atoms/TextArea';
import SelectInput from '@/components/atoms/SelectInput';
import DateRangePicker from '@/components/atoms/DateRangePicker';
import DatePicker from '@/components/atoms/DatePicker';
import Button from '@/components/atoms/Button';

const MENU_HR = [
  { label: 'Kelola Lowongan', icon: Briefcase, href: '/hr/dashboard' },
  { label: 'Daftar Pelamar', icon: List, href: '/hr/applicants' },
];

const STATUS_GAJI_OPTIONS = [
  { value: 'Paid', label: 'Paid Internship' },
  { value: 'Unpaid', label: 'Unpaid Internship' },
];

const STATUS_PELAKSANAAN_OPTIONS = [
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'WFO', label: 'WFO (Work From Office)' },
  { value: 'WFA', label: 'WFA (Work From Anywhere)' },
];

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

  function onLogout() {
    navigate('/login');
  }

  function validate() {
    const newErrors = {};
    if (!posisi) newErrors.posisi = 'Posisi wajib diisi';
    if (!deskripsi) newErrors.deskripsi = 'Deskripsi wajib diisi';
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
        ? detail.map(d => `${d.loc[d.loc.length - 1]}: ${d.msg}`).join(', ')
        : (detail || 'Gagal membuat lowongan. Coba lagi.');
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: '#EEF0F8', display: 'flex', flexDirection: 'column' }}>
      <Navbar variant="app" user={{ name: 'HR Manager' }} onLogout={onLogout} />

      <div style={{ flex: 1 }}>
        <SidebarLayout
          sidebar={<Sidebar menuItems={MENU_HR} activeHref="/hr/dashboard" />}
        >
          <div style={{ marginBottom: '20px' }}>
            <Breadcrumb
              items={[
                { label: 'Kelola Lowongan', href: '/hr/dashboard' },
                { label: 'Buat Lowongan Baru' },
              ]}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <FormSectionCard title="Informasi Umum" icon={<FileText size={18} />}>
              <TextInput
                label="Posisi yang Ditawarkan"
                placeholder="Contoh: UI/UX Designer"
                value={posisi}
                onChange={(e) => setPosisi(e.target.value)}
                error={errors.posisi}
              />
              <TextArea
                label="Deskripsi Pekerjaan"
                placeholder="Jelaskan peran dan tanggung jawab..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                error={errors.deskripsi}
                rows={3}
              />
              <TextArea
                label="Persyaratan"
                placeholder="Persyaratan..."
                value={persyaratan}
                onChange={(e) => setPersyaratan(e.target.value)}
                rows={3}
              />
              <TextArea
                label="Benefit"
                placeholder="Sebutkan benefit yang didapatkan kandidat..."
                value={benefit}
                onChange={(e) => setBenefit(e.target.value)}
                rows={3}
              />
            </FormSectionCard>

            <FormSectionCard title="Detail Lowongan" icon={<FileText size={18} />}>
              <TextInput
                label="Lokasi"
                placeholder="Alamat perusahaan..."
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                error={errors.lokasi}
              />
              <TextInput
                label="Industri"
                placeholder="Bidang industri..."
                value={industri}
                onChange={(e) => setIndustri(e.target.value)}
                error={errors.industri}
              />
              <DateRangePicker
                label="Waktu Mulai Magang dan Akhir Magang"
                placeholder="Pilih waktu"
                value={waktuMagang}
                onChange={setWaktuMagang}
                error={errors.waktuMagang}
              />
              <TextInput
                label="Kuota"
                placeholder="Bidang industri..."
                value={kuota}
                onChange={(e) => setKuota(e.target.value)}
                error={errors.kuota}
                type="number"
              />
              <SelectInput
                label="Status Gaji"
                placeholder="Pilih status gaji..."
                value={statusGaji}
                onChange={(e) => setStatusGaji(e.target.value)}
                options={STATUS_GAJI_OPTIONS}
                error={errors.statusGaji}
              />
              <SelectInput
                label="Status Pelaksanaan"
                placeholder="Pilih status pelaksanaan..."
                value={statusPelaksanaan}
                onChange={(e) => setStatusPelaksanaan(e.target.value)}
                options={STATUS_PELAKSANAAN_OPTIONS}
                error={errors.statusPelaksanaan}
              />
              <DatePicker
                label="Tanggal Lowongan Ditutup"
                placeholder="dd/mm/yyyy"
                value={tanggalDitutup}
                onChange={setTanggalDitutup}
                error={errors.tanggalDitutup}
              />
            </FormSectionCard>
          </div>

          <div style={{ marginTop: '20px' }}>
            <FormActionBar
              onCancel={() => navigate('/hr/dashboard')}
              onSubmit={onSubmitHandler}
              cancelLabel="Batal"
              submitLabel={isLoading ? 'Menyimpan...' : 'Simpan Lowongan'}
              submitIcon={<Save size={15} />}
              disabled={isLoading}
            />
          </div>
        </SidebarLayout>
      </div>

      <PageFooter />

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