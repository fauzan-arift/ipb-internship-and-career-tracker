import React, { useState } from 'react';
import Sidebar from '../../components/organisms/Sidebar';
import StatCard from '../../components/molecules/StatCard';
import ApplicationListItem from '../../components/molecules/ApplicationListItem';
import ApplicationDetailPanel from '../../components/organisms/ApplicationDetailPanel';

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

  const total = dummyApplications.length;
  const diproses = dummyApplications.filter(a => a.status === 'Diproses').length;
  const diterima = dummyApplications.filter(a => a.status === 'Diterima').length;
  const ditolak = dummyApplications.filter(a => a.status === 'Ditolak').length;

  return (
    <div className="w-screen ml-[calc(50%-50vw)] overflow-x-hidden bg-[#F3F4FF] min-h-screen">
      <div className="flex w-full h-screen">
        <div className="hidden md:block w-64 flex-shrink-0 bg-[#F8F9FE] border-r border-gray-200 h-full">
          <Sidebar activeMenu="Lamaran Saya" />
        </div>

        <div className="flex-1 h-full overflow-y-auto p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Lamaran Saya</h1>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Lamaran" value={total} />
            <StatCard label="Sedang Diproses" value={diproses} variant="blue" />
            <StatCard label="Diterima" value={diterima} variant="green" />
            <StatCard label="Ditolak" value={ditolak} variant="red" />
          </div>

          <div className="flex gap-6 h-[calc(100%-150px)]">
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

            <div className="w-5/12 overflow-y-auto">
              <ApplicationDetailPanel application={applicationWithReversedTimeline} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyApplications;