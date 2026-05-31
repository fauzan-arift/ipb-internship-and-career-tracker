import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Users, Clock, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import AvatarSquare from '@/components/atoms/AvatarSquare';
import { useCareerMapping } from '@/hooks/useCareerMapping';

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

// Consistent pastel color per company name (deterministic)
const PALETTE = [
  '#3D3FA8', '#0E7490', '#065F46', '#92400E',
  '#6D28D9', '#BE185D', '#1D4ED8', '#B45309',
];
function colorFor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

const Shimmer = ({ className = '', style = {} }) => (
  <div
    className={`relative overflow-hidden bg-gray-100 rounded ${className}`}
    style={{ isolation: 'isolate', ...style }}
  >
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
      animation: 'shimmer 1.6s infinite',
    }} />
    <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
  </div>
);

function CareerMappingSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Shimmer className="h-8 w-52 rounded-full" />
      {/* Header card */}
      <div className="bg-white rounded-xl border border-[#DBD9E1] p-6 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-3">
          <Shimmer className="h-3 w-32 rounded-full" />
          <Shimmer className="h-6 w-56 rounded-full" />
          <Shimmer className="h-3 w-44 rounded-full" />
        </div>
        <Shimmer className="h-20 w-44 rounded-xl" />
      </div>
      {/* Table card */}
      <div className="bg-white rounded-xl border border-[#DBD9E1] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#DBD9E1]">
          <Shimmer className="h-4 w-48 rounded-full" />
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <Shimmer className="w-9 h-9 rounded-lg flex-shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <Shimmer className="h-3.5 w-36 rounded-full" />
                  <Shimmer className="h-3 w-24 rounded-full" />
                </div>
              </div>
              <Shimmer className="h-4 w-10 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CareerMapping() {
  const { data, isLoading, error, refresh } = useCareerMapping();


  if (isLoading) return <CareerMappingSkeleton />;


  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'Inter, sans-serif', margin: 0 }}>
          Career Mapping
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
          <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-2 flex-1">
            <span className="text-red-700 font-medium text-sm">{error}</span>
            {error.toLowerCase().includes('fakultas') || error.toLowerCase().includes('jurusan') ? (
              <span className="text-red-500 text-xs">
                Lengkapi data fakultas dan jurusan di halaman profil terlebih dahulu.
              </span>
            ) : null}
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 font-medium transition-colors flex-shrink-0"
          >
            <RefreshCw size={14} />
            Coba lagi
          </button>
        </div>
      </div>
    );
  }


  const companies = data?.company_distributions ?? [];
  const grandTotal = data?.grand_total_students ?? 0;
  const faculty = data?.faculty ?? '';
  const major = data?.major ?? '';

  const formattedDate = data?.last_updated
    ? format(new Date(data.last_updated), 'dd MMM yyyy, HH:mm', { locale: idLocale })
    : null;

  // Sort already done by backend (desc by total_alumni), but be safe
  const sortedCompanies = [...companies].sort((a, b) => b.total_alumni - a.total_alumni);
  const maxAlumni = sortedCompanies[0]?.total_alumni || 1;

  return (
    <div className="flex flex-col gap-6">
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'Inter, sans-serif', margin: 0 }}>
        Career Mapping
      </h1>

      {/* ── Header Card ── */}
      <div className="bg-white rounded-xl border border-[#DBD9E1] p-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-2">
          {faculty && (
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#3D3FA8', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {faculty}
            </span>
          )}
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'Inter, sans-serif', margin: 0 }}>
            {major || '-'}
          </h2>
          {formattedDate ? (
            <div className="flex items-center gap-2">
              <Clock size={14} color="#6B7280" />
              <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                Terakhir diperbarui: {formattedDate}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Clock size={14} color="#9CA3AF" />
              <span style={{ fontSize: '13px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}>
                Belum ada data
              </span>
            </div>
          )}
        </div>

        {/* Total badge */}
        <div className="bg-[#EEF0FF] rounded-xl p-4 flex items-center gap-3 min-w-[180px]">
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#3D3FA8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Users size={20} color="white" />
          </div>
          <div className="flex flex-col gap-1">
            <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              Total Mahasiswa Terdata
            </span>
            <span style={{ fontSize: '24px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>
              {grandTotal.toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Distribution Table ── */}
      <div className="bg-white rounded-xl border border-[#DBD9E1] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#DBD9E1] flex items-center justify-between">
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1A1A2E', fontFamily: 'Inter, sans-serif', margin: 0 }}>
            Distribusi Perusahaan Terdaftar
          </h3>
          <button
            onClick={refresh}
            title="Perbarui data"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#3D3FA8] transition-colors"
          >
            <RefreshCw size={13} />
            Perbarui
          </button>
        </div>

        {sortedCompanies.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 px-6 text-center">
            <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#EEF0FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={22} color="#3D3FA8" />
            </div>
            <p style={{ fontWeight: '600', color: '#1A1A2E', fontSize: '15px', fontFamily: 'Inter, sans-serif', margin: 0 }}>
              Belum ada data distribusi
            </p>
            <p style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif', margin: 0, maxWidth: 320 }}>
              Data akan muncul secara otomatis ketika mahasiswa dari jurusan Anda mulai menerima penawaran magang.
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#EEF0F8', borderBottom: '1px solid #CBD0E0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em', width: '50%' }}>
                  Perusahaan
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Distribusi
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6B7280', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Alumni
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedCompanies.map((company, index) => {
                const initials = getInitials(company.company_name);
                const bgColor = colorFor(company.company_name);
                const barWidth = Math.round((company.total_alumni / maxAlumni) * 100);

                return (
                  <tr
                    key={`${company.company_name}-${index}`}
                    style={{ borderBottom: index < sortedCompanies.length - 1 ? '1px solid #E5E7EB' : 'none' }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Company info */}
                    <td style={{ padding: '14px 16px' }}>
                      <div className="flex items-center gap-3">
                        <AvatarSquare
                          name={initials}
                          imageUrl={company.company_logo_url}
                          bg={bgColor}
                          color="#FFFFFF"
                          size={36}
                        />
                        <div className="flex flex-col gap-0.5">
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
                            {company.company_name}
                          </span>
                          {company.industry && (
                            <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                              {company.industry}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Progress bar */}
                    <td style={{ padding: '14px 16px' }}>
                      <div className="flex items-center gap-2">
                        <div style={{ flex: 1, height: 6, backgroundColor: '#E5E7EB', borderRadius: 99, overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${barWidth}%`,
                              height: '100%',
                              backgroundColor: bgColor,
                              borderRadius: 99,
                              transition: 'width 0.4s ease',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Inter, sans-serif', minWidth: 30, textAlign: 'right' }}>
                          {barWidth}%
                        </span>
                      </div>
                    </td>

                    {/* Count */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}>
                        {company.total_alumni.toLocaleString('id-ID')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}