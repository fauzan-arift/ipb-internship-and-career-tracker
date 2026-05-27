import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Users, Clock } from 'lucide-react';
import AvatarSquare from '@/components/atoms/AvatarSquare';
import dummyCareerMapping from '@/data/dummyCareerMapping';
import api from '@/api/axios';

function CareerMapping() {
  const [data] = useState(dummyCareerMapping);
  const [faculty, setFaculty] = useState('');
  const [major, setMajor] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/students/profile');
        setFaculty(res.data?.faculty ?? '');
        setMajor(res.data?.major ?? '');
      } catch {
        setFaculty(Object.keys(data.totalStudentsByFaculty)[0]);
        setMajor('');
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  // Filter perusahaan yang ada mahasiswa dari fakultas ini
  const filteredCompanies = faculty
    ? data.companies.filter(
        (c) => c.studentsByFaculty[faculty] !== undefined
      ).map((c) => ({
        ...c,
        totalStudents: c.studentsByFaculty[faculty],
      }))
    : [];

  const totalStudents = faculty
    ? (data.totalStudentsByFaculty[faculty] ?? 0)
    : 0;

  const formattedDate = data.lastUpdated
    ? format(new Date(data.lastUpdated), 'dd MMM yyyy', { locale: id })
    : '-';

  return (
    <div className="flex flex-col gap-6">
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'Inter, sans-serif', margin: 0 }}>
        Career Mapping
      </h1>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-[#DBD9E1] p-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-2">
          {!isLoadingProfile && faculty && (
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#3D3FA8', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {faculty}
            </span>
          )}
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'Inter, sans-serif', margin: 0 }}>
            {isLoadingProfile ? '...' : major || '-'}
          </h2>
          <div className="flex items-center gap-2">
            <Clock size={16} color="#6B7280" />
            <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              Terakhir diperbarui: {formattedDate}
            </span>
          </div>
        </div>

        {/* Total Mahasiswa */}
        <div className="bg-[#EEF0FF] rounded-xl p-4 flex items-center gap-3 min-w-[180px]">
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#3D3FA8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Users size={20} color="white" />
          </div>
          <div className="flex flex-col gap-1">
            <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              Total Mahasiswa Terdata
            </span>
            <span style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>
              {isLoadingProfile ? '...' : totalStudents.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* Tabel Distribusi */}
      <div className="bg-white rounded-xl border border-[#DBD9E1] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#DBD9E1]">
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1A1A2E', fontFamily: 'Inter, sans-serif', margin: 0 }}>
            Distribusi Perusahaan Terdaftar
          </h3>
        </div>

        {isLoadingProfile ? (
          <div style={{ padding: '24px', textAlign: 'center', fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            Memuat data...
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
            Tidak ada data perusahaan untuk fakultas ini
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#EEF0F8', borderBottom: '1px solid #CBD0E0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Nama Perusahaan
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6B7280', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Mahasiswa
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company, index) => (
                <tr
                  key={company.id}
                  style={{ borderBottom: index < filteredCompanies.length - 1 ? '1px solid #E5E7EB' : 'none' }}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div className="flex items-center gap-3">
                      <AvatarSquare
                        name={company.logoInitials}
                        bg={company.logoColor}
                        color="#FFFFFF"
                        size={36}
                      />
                      <div className="flex flex-col gap-0.5">
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
                          {company.name}
                        </span>
                        <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                          {company.industry}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
                    {company.totalStudents.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CareerMapping;