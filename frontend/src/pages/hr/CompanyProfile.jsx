import { useState, useEffect, useRef } from 'react'
import { Save, Pencil } from 'lucide-react'
import hrService from '@/services/hrService'
import TextInput from '@/components/atoms/TextInput'
import FormField from '@/components/molecules/FormField'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const ProfileSkeleton = () => (
  <div className="flex flex-col gap-6 animate-pulse">
    {[1, 2].map((i) => (
      <div key={i} className="bg-white rounded-xl border border-[#DBD9E1] p-6 flex flex-col gap-4">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="flex flex-col gap-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-12 bg-gray-200 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

const VerificationBadge = ({ status }) => {
  const map = {
    VERIFIED: { label: 'Terverifikasi',       className: 'bg-[#D1FAE5] text-[#065F46]' },
    PENDING:  { label: 'Menunggu Verifikasi', className: 'bg-[#FFF2DF] text-[#A65E34]' },
    REJECTED: { label: 'Ditolak',             className: 'bg-[#FEF2F2] text-[#B91C1C]' },
  }
  const badge = map[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge.className}`}>
      {badge.label}
    </span>
  )
}

const InfoRow = ({ label, value, children }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[#787584] text-xs font-semibold uppercase tracking-widest">{label}</span>
    {children ?? <span className="text-[#1B1B21] text-sm font-medium">{value ?? '-'}</span>}
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

/**
 * CompanyProfile page
 *
 * Route  : /hr/profile
 * Layout : DashboardLayout role="hr" wraps this in App.jsx
 */
export default function CompanyProfile() {
  // ── Server state ──
  const [profile, setProfile]       = useState(null)
  const [isLoading, setIsLoading]   = useState(true)
  const [isSaving, setIsSaving]     = useState(false)
  const [isError, setIsError]       = useState(false)
  const [errorMsg, setErrorMsg]     = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // ── Editable fields ──
  const [companyName, setCompanyName] = useState('')
  const [address, setAddress]         = useState('')
  const [industry, setIndustry]       = useState('')
  const [website, setWebsite]         = useState('')
  const [description, setDescription] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')

  // ── Editable personal fields ──
  const [fullName, setFullName]       = useState('')
  const [position, setPosition]       = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [hrEmail, setHrEmail]         = useState('')

  // ── Photo state ──
  const [photoUrl, setPhotoUrl]         = useState(null)
  const [newPhotoFile, setNewPhotoFile] = useState(null)
  const photoInputRef = useRef(null)

  // ── Fetch on mount ──
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        const data = await hrService.getProfile()
        setProfile(data)
        setCompanyName(data.company_name ?? '')
        setAddress(data.address ?? '')
        setIndustry(data.industry ?? '')
        setWebsite(data.website ?? '')
        setDescription(data.description ?? '')
        setCompanyEmail(data.email ?? '')
        setPhotoUrl(data.photo_profile_url ?? null)

        // Fetch personal info
        const personal = await hrService.getPersonalProfile()
        setFullName(personal.full_name ?? '')
        setPosition(personal.position ?? '')
        setPhoneNumber(personal.phone_number ?? '')
        setHrEmail(personal.email ?? '')
      } catch (err) {
        setIsError(true)
        setErrorMsg(err?.response?.data?.detail ?? 'Gagal memuat profil perusahaan.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // ── Photo ──
  const handlePhotoFile = (file) => {
    if (!file) return
    setNewPhotoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoUrl(ev.target.result)
    reader.readAsDataURL(file)
  }

  // ── Save ──
  const handleSave = async () => {
    setIsSaving(true)
    setErrorMsg('')
    setSuccessMsg('')
    try {
      let photoId = profile?.photo_profile_id ?? undefined

      if (newPhotoFile) {
        const uploaded = await hrService.uploadPhoto(newPhotoFile)
        photoId = uploaded.id
        setNewPhotoFile(null)
      }

      const payload = {
        company_name: companyName,
        address:      address,
        industry:     industry,
        website:      website,
        description:  description,
        email:        companyEmail,
        ...(photoId && { photo_profile_id: photoId }),
      }

      const updated = await hrService.updateProfile(payload)
      
      // Save personal info
      const personalPayload = {
        full_name:    fullName,
        position:     position,
        phone_number: phoneNumber,
      }
      await hrService.updatePersonalProfile(personalPayload)

      setProfile(updated)
      setPhotoUrl(updated.photo_profile_url ?? photoUrl)
      setSuccessMsg('Profil berhasil disimpan!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      const detail = err?.response?.data?.detail
      if (Array.isArray(detail)) {
        setErrorMsg(detail.map((d) => d.msg).join(', '))
      } else {
        setErrorMsg(detail ?? 'Gagal menyimpan profil. Coba lagi.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  // ── Loading ──
  if (isLoading) return (
    <div className="px-8 py-8 max-w-[860px] mx-auto">
      <ProfileSkeleton />
    </div>
  )

  // ── Error ──
  if (isError) return (
    <div className="px-8 py-8 max-w-[860px] mx-auto flex flex-col items-center gap-4 mt-16">
      <p className="text-[#1B1B21] text-lg font-semibold">Gagal memuat profil perusahaan</p>
      <p className="text-[#454651] text-sm">{errorMsg}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-5 py-2 rounded-lg bg-[#4D44B5] text-white text-sm font-medium hover:bg-[#3d369a] transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  )

  return (
    <div className="px-8 py-8 max-w-[860px] mx-auto flex flex-col gap-6">

      {/* Toast messages */}
      {successMsg && (
        <div className="px-4 py-3 rounded-lg bg-[#D1FAE5] border border-[#6EE7B7] text-[#065F46] text-sm font-medium">
          {successMsg}
        </div>
      )}
      {errorMsg && !isError && (
        <div className="px-4 py-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* ── Card 1: Informasi Perusahaan ── */}
      <div className="bg-white rounded-xl border border-[#DBD9E1] p-6 flex flex-col gap-5">

        {/* Logo row */}
        <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-2xl border border-gray-200 bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
            {photoUrl
            ? <img src={photoUrl} alt="Logo perusahaan" className="w-full h-full object-cover" />
            : <span className="text-2xl font-bold text-[#4D44B5]">{companyName?.charAt(0) ?? '?'}</span>
            }
        </div>
        <div className="flex flex-col gap-2">
            <button
            onClick={() => photoInputRef.current?.click()}
            className="flex items-center gap-1.5 text-sm text-[#4D44B5] font-medium hover:opacity-70 transition-opacity"
            >
            <Pencil size={14} />
            Ganti Logo
            </button>
            {newPhotoFile && (
            <span className="text-xs text-gray-500">{newPhotoFile.name} — simpan untuk menerapkan</span>
            )}
            {/* Email HR — read only */}
            <span className="text-sm text-[#6B7280]">{hrEmail}</span>
        </div>
        </div>

        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handlePhotoFile(e.target.files?.[0])}
        />

        <div className="border-b border-[#DBD9E1] pb-1">
          <h2 className="text-[#1B1B21] font-semibold text-xl leading-7">Informasi Perusahaan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Nama Perusahaan */}
          <FormField label="Nama Perusahaan">
            <TextInput
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="contoh: PT Maju Bersama"
            />
          </FormField>

          {/* Industri */}
          <FormField label="Industri">
            <TextInput
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="contoh: Teknologi, Pertanian..."
            />
          </FormField>

          {/* Website — plain TextInput, no icon overlap */}
          <FormField label="Website">
            <TextInput
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="contoh: https://perusahaan.com"
            />
          </FormField>

          {/* Alamat — plain TextInput, no icon overlap */}
          <FormField label="Alamat">
            <TextInput
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="contoh: Jl. Raya Dramaga, Bogor"
            />
          </FormField>

          {/* Deskripsi — full width */}
          <div className="md:col-span-2">
            <FormField label="Deskripsi Perusahaan">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan tentang perusahaan Anda..."
                rows={4}
                className="w-full px-4 py-3.5 rounded-lg border border-[#CBD0E0] bg-white text-black text-base outline-none focus:border-[#4D44B5] focus:ring-1 focus:ring-[#4D44B5] transition-colors resize-none"
              />
            </FormField>
          </div>

          {/* Status Verifikasi — read only, full width */}
          <div className="md:col-span-2 pt-2 border-t border-[#DBD9E1]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <InfoRow label="Status Verifikasi">
                <VerificationBadge status={profile?.verification_status} />
              </InfoRow>
              <InfoRow
                label="Tanggal Bergabung"
                value={formatDate(profile?.registration_date)}
              />
              {profile?.verified_at && (
                <InfoRow
                  label="Terverifikasi Pada"
                  value={formatDate(profile?.verified_at)}
                />
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ── Card 2: Informasi Pribadi HR ── */}
      <div className="bg-white rounded-xl border border-[#DBD9E1] p-6 flex flex-col gap-5">
        <div className="border-b border-[#DBD9E1] pb-1">
          <h2 className="text-[#1B1B21] font-semibold text-xl leading-7">Informasi Pribadi HR</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nama Lengkap">
            <TextInput
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
            />
          </FormField>

          <FormField label="Jabatan / Posisi">
            <TextInput
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="contoh: HR Manager, Recruiter"
            />
          </FormField>

          <FormField label="Nomor Telepon">
            <TextInput
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="contoh: 08123456789"
            />
          </FormField>

        </div>
      </div>

      {/* ── Save ── */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#4D44B5] text-white font-medium text-base hover:bg-[#3d369a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

    </div>
  )
}