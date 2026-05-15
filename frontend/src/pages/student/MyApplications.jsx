import React, { useState } from 'react';
import StatCard from '@/components/molecules/StatCard';
import ApplicationListItem from '@/components/molecules/ApplicationListItem';
import ApplicationDetailPanel from '@/components/organisms/ApplicationDetailPanel';

// 🧪 DUMMY DATA
const dummyApplications = [
  {
    id: 1,
    logo: 'T',
    position: 'Data Analyst Intern',
    company: 'PT Telekomunikasi Selular (Telkomsel)',
    date: '12 Okt 2023',
    status: 'Diproses',
    timeline: [
      { 
        title: 'Lamaran Terkirim', 
        description: 'Aplikasi, CV, dan dokumen pendukung berhasil dikirim ke portal perusahaan.', 
        date: '12 Okt 2023 - 09:00 WIB',
        state: 'done' 
      },
      { 
        title: 'Seleksi Administrasi HR', 
        description: 'Berkas sedang dalam tahap verifikasi oleh tim Human Resources.', 
        date: '14 Okt 2023 - 14:15 WIB',
        state: 'done' 
      },
      { 
        title: 'Sedang Direview HR', 
        description: 'Berkas Anda telah lolos seleksi awal dan sedang dipertimbangkan oleh tim User Data Analytics.', 
        date: '18 Okt 2023 - 10:30 WIB',
        state: 'active' 
      },
      { 
        title: 'Wawancara', 
        description: 'Menunggu jadwal wawancara.', 
        date: '-',
        state: 'pending' 
      },
    ]
  },
  {
    id: 2,
    logo: 'B',
    position: 'IT Risk Assurance Intern',
    company: 'PT Bank Central Asia Tbk',
    date: '12 Okt 2023',
    status: 'Diterima',
    timeline: [
      { 
        title: 'Lamaran Terkirim', 
        description: 'Aplikasi, CV, dan dokumen pendukung berhasil dikirim ke portal perusahaan.', 
        date: '12 Okt 2023 - 09:00 WIB',
        state: 'done' 
      },
      { 
        title: 'Seleksi Administrasi HR', 
        description: 'Berkas lolos verifikasi HR.', 
        date: '14 Okt 2023 - 11:00 WIB',
        state: 'done' 
      },
      { 
        title: 'Seleksi Berkas', 
        description: 'Dokumen lengkap dan sesuai kualifikasi.', 
        date: '16 Okt 2023 - 09:30 WIB',
        state: 'done' 
      },
      { 
        title: 'Wawancara', 
        description: 'Lolos wawancara tahap 1 dan 2.', 
        date: '20 Okt 2023 - 14:00 WIB',
        state: 'done' 
      },
      { 
        title: 'Diterima', 
        description: 'Selamat! Anda diterima magang di BCA.', 
        date: '22 Okt 2023 - 16:00 WIB',
        state: 'done' 
      },
    ]
  },
];

function MyApplications() {
  const [selectedId, setSelectedId] = useState(dummyApplications[0].id);
  const selectedApp = dummyApplications.find(app => app.id === selectedId);
  const applicationWithReversedTimeline = selectedApp 
    ? { ...selectedApp, timeline: [...selectedApp.timeline].reverse() } 
    : null;

  // Hitung statistik
  const total = dummyApplications.length;
  const diproses = dummyApplications.filter(a => a.status === 'Diproses').length;
  const diterima = dummyApplications.filter(a => a.status === 'Diterima').length;
  const ditolak = dummyApplications.filter(a => a.status === 'Ditolak').length;

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Lamaran Saya</h1>

      {/* Statistik */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Lamaran" value={total} />
        <StatCard label="Sedang Diproses" value={diproses} variant="blue" />
        <StatCard label="Diterima" value={diterima} variant="green" />
        <StatCard label="Ditolak" value={ditolak} variant="red" />
      </div>

      {/* Layout 2 Kolom */}
      <div className="flex gap-6 h-[calc(100vh-250px)]">
        {/* Kiri: Daftar Lamaran */}
        <div className="w-7/12 bg-white rounded-xl border border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-semibold text-gray-800 mb-4">Daftar Lamaran Magang</h3>
          <div className="space-y-3">
            {dummyApplications.map((app) => (
              <ApplicationListItem
                key={app.id}
                logo={app.logo}
                position={app.position}
                company={app.company}
                date={app.date}
                status={app.status}
                isActive={selectedId === app.id}
                onClick={() => setSelectedId(app.id)}
              />
            ))}
          </div>
        </div>

        {/* Kanan: Detail Panel */}
        <div className="w-5/12 overflow-y-auto">
          <ApplicationDetailPanel application={applicationWithReversedTimeline} />
        </div>
      </div>
    </div>
  );
}

export default MyApplications;