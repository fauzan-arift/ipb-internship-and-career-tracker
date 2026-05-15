import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { internshipService } from '@/services/internshipService'

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

const formatDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return '-'
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffMonths =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  const startLabel = start.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
  const endLabel = end.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
  return `${diffMonths} Bulan (${startLabel} - ${endLabel})`
}

const getWorkStatusBadge = (status) => {
  const map = {
    WFO:    { label: 'WFO',    className: 'bg-[#DBEAFE] text-[#1E40AF]' },
    WFH:    { label: 'WFH',    className: 'bg-[#D1FAE5] text-[#065F46]' },
    Hybrid: { label: 'Hybrid', className: 'bg-[#FDFFBC] text-[#A07232]' },
  }
  return map[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' }
}

const getPaymentStatusBadge = (status) => {
  const map = {
    Paid:   { label: 'Paid Internship',   className: 'bg-[#D1FAE5] text-[#065F46]' },
    Unpaid: { label: 'Unpaid Internship', className: 'bg-[#FFF2DF] text-[#A65E34]' },
  }
  return map[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' }
}

// ─── Icons ───────────────────────────────────────────────────────────────────

const FileTextIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21072 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8M14 2C14.3166 1.99949 14.6301 2.06161 14.9225 2.18277C15.215 2.30394 15.4806 2.48176 15.704 2.706L19.292 6.294C19.5168 6.51751 19.6952 6.78335 19.8167 7.07616C19.9382 7.36898 20.0005 7.68297 20 8M14 2V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89465 14.7348 8 15 8L20 8M10 9H8M16 13H8M16 17H8" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21M16 3.128C16.8578 3.35037 17.6174 3.85126 18.1597 4.55206C18.702 5.25286 18.9962 6.11389 18.9962 7C18.9962 7.88611 18.702 8.74714 18.1597 9.44794C17.6174 10.1487 16.8578 10.6496 16 10.872M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 10C20 14.993 14.461 20.193 12.601 21.799C12.4277 21.9293 12.2168 21.9998 12 21.9998C11.7832 21.9998 11.5723 21.9293 11.399 21.799C9.539 20.193 4 14.993 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const GlobeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12C22 17.5228 17.5228 22 12 22M22 12C22 6.47715 17.5228 2 12 2M22 12H2M12 22C6.47715 22 2 17.5228 2 12M12 22C9.43223 19.3038 8 15.7233 8 12C8 8.27674 9.43223 4.69615 12 2M12 22C14.5678 19.3038 16 15.7233 16 12C16 8.27674 14.5678 4.69615 12 2M2 12C2 6.47715 6.47715 2 12 2" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ─── Sub-components ──────────────────────────────────────────────────────────

const HeroSkeleton = () => (
  <div className="flex items-center justify-between bg-white rounded-xl border border-[#DBD9E1] px-8 py-8 gap-4 animate-pulse">
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
        <div className="h-6 w-28 bg-gray-200 rounded-full" />
      </div>
    </div>
    <div className="h-10 w-36 bg-gray-200 rounded-lg shrink-0" />
  </div>
)

const CardSkeleton = () => (
  <div className="bg-white rounded-xl border border-[#DBD9E1] p-6 flex flex-col gap-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/3" />
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  </div>
)

const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-2">
    {icon}
    <h2 className="text-[#1B1B21] text-xl font-semibold leading-7">{title}</h2>
  </div>
)

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    {icon}
    <div className="flex flex-col gap-0.5">
      <span className="text-[#767682] text-xs font-normal leading-4">{label}</span>
      <span className="text-[#1B1B21] text-base font-medium leading-6">{value}</span>
    </div>
  </div>
)

const TextBlock = ({ text }) => {
  if (!text) return null
  const lines = text.split('\n').filter(Boolean)
  return lines.length > 1 ? (
    <ul className="list-disc list-inside flex flex-col gap-1 text-[#454651] text-base font-normal leading-6">
      {lines.map((line, i) => <li key={i}>{line}</li>)}
    </ul>
  ) : (
    <p className="text-[#454651] text-base font-normal leading-6">{text}</p>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

/**
 * InternshipDetail page
 *
 * Route   : /lowongan/:internship_id
 * Layout  : DashboardLayout (role="student") wraps this in App.jsx
 * This component renders ONLY the page content — no sidebar, no layout shell.
 */
export default function InternshipDetail() {
  const { internship_id } = useParams()
  const navigate = useNavigate()

  const [internship, setInternship] = useState(null)
  const [isLoading, setIsLoading]   = useState(false)
  const [isError, setIsError]       = useState(false)
  const [error, setError]           = useState(null)
  const [isApplying, setIsApplying] = useState(false)

  // ── Fetch detail ──
  useEffect(() => {
    if (!internship_id) return
    const fetchDetail = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        const data = await internshipService.getDetail(internship_id)
        setInternship(data)
      } catch (err) {
        setIsError(true)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDetail()
  }, [internship_id])

  // ── Apply ──
  const handleApply = async () => {
    setIsApplying(true)
    try {
      await internshipService.apply(internship_id)
      alert('Lamaran berhasil dikirim!')
    } catch (err) {
      const message = err?.response?.data?.detail ?? 'Gagal mengirim lamaran. Coba lagi.'
      alert(message)
    } finally {
      setIsApplying(false)
    }
  }

  const workBadge    = internship ? getWorkStatusBadge(internship.work_status) : null
  const paymentBadge = internship ? getPaymentStatusBadge(internship.payment_status) : null

  // ── Render ──
  // No flex wrapper, no sidebar, no min-h-screen here.
  // DashboardLayout in App.jsx handles all of that.
  return (
    <div className="px-8 py-8 max-w-275 mx-auto flex flex-col gap-6">

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-3">
        <Link
          to="/lowongan"
          className="text-[#454651] text-base font-normal leading-5 hover:underline"
        >
          Lowongan Magang
        </Link>
        <ChevronRightIcon />
        <span className="text-[#1B1B21] text-base font-medium leading-5">
          Detail Lowongan
        </span>
      </nav>

      {/* Error state */}
      {isError && (
        <div className="flex flex-col items-center gap-4 mt-16">
          <p className="text-[#1B1B21] text-lg font-semibold">
            Lowongan tidak ditemukan
          </p>
          <p className="text-[#454651] text-sm">
            {error?.response?.data?.detail ?? 'Terjadi kesalahan saat memuat data.'}
          </p>
          <button
            onClick={() => navigate('/lowongan')}
            className="px-5 py-2 rounded-lg bg-[#4D44B5] text-white text-sm font-medium hover:bg-[#3d369a] transition-colors"
          >
            Kembali ke Daftar Lowongan
          </button>
        </div>
      )}

      {/* Hero Header Card */}
      {isLoading ? (
        <HeroSkeleton />
      ) : internship && (
        <div className="flex items-center justify-between bg-white rounded-xl border border-[#DBD9E1] px-8 py-8 gap-4 flex-wrap">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <h1 className="text-[#1B1B21] text-3xl font-bold leading-tight tracking-tight">
                {internship.title}
              </h1>
              <p className="text-[#1B1B21] text-base font-medium leading-6">
                {internship.company.company_name}
              </p>
              <div className="flex items-center gap-1">
                <LocationIcon />
                <span className="text-[#454651] text-base font-normal leading-6">
                  {internship.location}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium leading-4 ${workBadge.className}`}>
                {workBadge.label}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium leading-4 ${paymentBadge.className}`}>
                {paymentBadge.label}
              </span>
            </div>
          </div>
          <button
            onClick={handleApply}
            disabled={isApplying || !internship.is_active}
            className="flex items-center justify-center px-5 py-2 rounded-lg bg-[#4D44B5] text-white text-base font-medium leading-6 tracking-wide hover:bg-[#3d369a] transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? 'Mengirim...' : 'Lamar Sekarang'}
          </button>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* Left Column — job description, requirements, benefits */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {isLoading ? (
            <CardSkeleton />
          ) : internship && (
            <div className="bg-white rounded-xl border border-[#DBD9E1] p-6 flex flex-col gap-4">
              <SectionHeader icon={<FileTextIcon />} title="Deskripsi Pekerjaan" />
              <TextBlock text={internship.description} />

              <div className="mt-2">
                <SectionHeader icon={<FileTextIcon />} title="Persyaratan" />
              </div>
              <TextBlock text={internship.requirement} />

              <div className="mt-2">
                <SectionHeader icon={<FileTextIcon />} title="Benefit" />
              </div>
              <TextBlock text={internship.benefit} />
            </div>
          )}
        </div>

        {/* Right Column — internship info + company info */}
        <div className="flex flex-col gap-6">

          {/* Informasi Magang */}
          {isLoading ? (
            <CardSkeleton />
          ) : internship && (
            <div className="bg-white rounded-xl border border-[#DBD9E1] p-6 flex flex-col gap-4">
              <div className="pb-3 border-b border-[#DBD9E1]">
                <h2 className="text-[#1B1B21] text-xl font-semibold leading-7">
                  Informasi Magang
                </h2>
              </div>
              <div className="flex flex-col gap-4">
                <InfoRow
                  icon={<CalendarIcon />}
                  label="Batas Pendaftaran"
                  value={formatDate(internship.close_date)}
                />
                <InfoRow
                  icon={<ClockIcon />}
                  label="Durasi Magang"
                  value={formatDuration(internship.start_date, internship.end_date)}
                />
                <InfoRow
                  icon={<UsersIcon />}
                  label="Kapasitas"
                  value={`${internship.quota} Orang`}
                />
              </div>
            </div>
          )}

          {/* Tentang Perusahaan */}
          {isLoading ? (
            <CardSkeleton />
          ) : internship && (
            <div className="bg-white rounded-xl border border-[#DBD9E1] p-6 flex flex-col gap-4">
              <div className="pb-3 border-b border-[#DBD9E1]">
                <h2 className="text-[#1B1B21] text-xl font-semibold leading-7">
                  Tentang Perusahaan
                </h2>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <div className="w-20 h-20 flex items-center justify-center rounded-2xl border border-[#E5E1EB] bg-white shadow-sm shrink-0">
                  <span className="text-2xl font-bold text-[#4D44B5]">
                    {internship.company.company_name.charAt(0)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[#1B1B21] text-sm font-semibold leading-tight tracking-wide">
                    {internship.company.company_name}
                  </p>
                  <p className="text-[#454651] text-xs font-normal leading-4">
                    {internship.company.industry}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <p className="text-[#787584] text-xs font-semibold leading-4 tracking-widest uppercase">
                    Industri
                  </p>
                  <p className="text-[#474553] text-sm font-normal leading-5">
                    {internship.industry}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[#787584] text-xs font-semibold leading-4 tracking-widest uppercase">
                    Alamat
                  </p>
                  <div className="flex items-start gap-2">
                    <LocationIcon />
                    <p className="text-[#474553] text-sm font-normal leading-5">
                      {internship.company.address}
                    </p>
                  </div>
                </div>
                {internship.company.website && (
                  <div className="flex flex-col gap-1">
                    <p className="text-[#787584] text-xs font-semibold leading-4 tracking-widest uppercase">
                      Website
                    </p>
                    <div className="flex items-center gap-2">
                      <GlobeIcon />
                      <a
                        href={internship.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#35299D] text-sm font-normal leading-5 hover:underline break-all"
                      >
                        {internship.company.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}