import { useState, useEffect, useRef } from 'react'
import { studentService } from '@/services/studentService'
import { IPB_FACULTIES } from '@/constants/ipbData'
import TextInput from '@/components/atoms/TextInput'
import SelectInput from '@/components/atoms/SelectInput'
import FormField from '@/components/molecules/FormField'

// ─── Sub-components ──────────────────────────────────────────────────────────

const SkillChip = ({ label, onRemove }) => (
  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E8F0FE]">
    <span className="text-[#3730A3] font-medium text-xs leading-4">{label}</span>
    <button onClick={onRemove} className="flex items-center justify-center text-black hover:opacity-60 transition-opacity">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6L18 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  </div>
)

const ProfileSkeleton = () => (
  <div className="flex flex-col gap-6 animate-pulse">
    {[1, 2, 3].map((i) => (
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

// ─── Icons ───────────────────────────────────────────────────────────────────

const EditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 3.00023H5C4.46957 3.00023 3.96086 3.21094 3.58579 3.58601C3.21071 3.96109 3 4.46979 3 5.00023V19.0002C3 19.5307 3.21071 20.0394 3.58579 20.4144C3.96086 20.7895 4.46957 21.0002 5 21.0002H19C19.5304 21.0002 20.0391 20.7895 20.4142 20.4144C20.7893 20.0394 21 19.5307 21 19.0002V12.0002M18.375 2.62523C18.7728 2.2274 19.3124 2.00391 19.875 2.00391C20.4376 2.00391 20.9772 2.2274 21.375 2.62523C21.7728 3.02305 21.9963 3.56262 21.9963 4.12523C21.9963 4.68784 21.7728 5.2274 21.375 5.62523L12.362 14.6392C12.1245 14.8765 11.8312 15.0501 11.509 15.1442L8.636 15.9842C8.54995 16.0093 8.45874 16.0108 8.37191 15.9886C8.28508 15.9663 8.20583 15.9212 8.14245 15.8578C8.07907 15.7944 8.03389 15.7151 8.01164 15.6283C7.9894 15.5415 7.9909 15.4503 8.016 15.3642L8.856 12.4912C8.95053 12.1693 9.12453 11.8763 9.362 11.6392L18.375 2.62523Z"
      stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SaveIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M17 21V14C17 13.7348 16.8946 13.4804 16.7071 13.2929C16.5196 13.1054 16.2652 13 16 13H8C7.73478 13 7.48043 13.1054 7.29289 13.2929C7.10536 13.4804 7 13.7348 7 14V21M7 3V7C7 7.26522 7.10536 7.51957 7.29289 7.70711C7.48043 7.89464 7.73478 8 8 8H15M15.2 3C15.7275 3.00751 16.2307 3.22317 16.6 3.6L20.4 7.4C20.7768 7.76926 20.9925 8.27246 21 8.8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H15.2Z"
      stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C5.46957 2 4.96086 2.21072 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8M14 2C14.3166 1.99949 14.6301 2.06161 14.9225 2.18277C15.215 2.30394 15.4806 2.48176 15.704 2.706L19.292 6.294C19.5168 6.51751 19.6952 6.78335 19.8167 7.07616C19.9382 7.36898 20.0005 7.68297 20 8M14 2V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89465 14.7348 8 15 8L20 8M12 12V18M9 15L12 12L15 15"
      stroke="#574EBF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C5.46957 2 4.96086 2.21072 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8M14 2V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89465 14.7348 8 15 8L20 8M10 9H8M16 13H8M16 17H8"
      stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M3 6H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
      stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M5 12H19M12 5V19" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StudentProfile() {
  // ── Server state ──
  const [profile, setProfile]       = useState(null)
  const [isLoading, setIsLoading]   = useState(true)
  const [isSaving, setIsSaving]     = useState(false)
  const [isError, setIsError]       = useState(false)
  const [errorMsg, setErrorMsg]     = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // ── Form fields ──
  const [fullName, setFullName]             = useState('')
  const [email, setEmail]                   = useState('')
  const [nim, setNim]                       = useState('')
  const [faculty, setFaculty]               = useState('')
  const [major, setMajor]                   = useState('')
  const [gpa, setGpa]                       = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [phoneNumber, setPhoneNumber]       = useState('')
  const [skills, setSkills]                 = useState([])
  const [skillInput, setSkillInput]         = useState('')
  const [globalSkills, setGlobalSkills]     = useState([])

  // ── File state ──
  const [cvUrl, setCvUrl]               = useState(null)
  const [newCvFile, setNewCvFile]       = useState(null)
  const [isDragging, setIsDragging]     = useState(false)
  const [photoUrl, setPhotoUrl]         = useState(null)
  const [newPhotoFile, setNewPhotoFile] = useState(null)

  const fileInputRef  = useRef(null)
  const photoInputRef = useRef(null)

  // ── Derived ──
  const majorOptions = IPB_FACULTIES.find((f) => f.name === faculty)?.majors ?? []

  // ── Fetch on mount ──
  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      setIsError(false)
      try {
        const data = await studentService.getProfile()
        setProfile(data)
        setFullName(data.full_name ?? '')
        setEmail(data.email ?? '')
        setNim(data.nim ?? '')
        setFaculty(data.faculty ?? '')
        setMajor(data.major ?? '')
        setGpa(data.gpa != null ? String(data.gpa) : '')
        setGraduationYear(data.graduation_year != null ? String(data.graduation_year) : '')
        setPhoneNumber(data.phone_number ?? '')
        setSkills(data.skills ?? [])
        setCvUrl(data.cv_url ?? null)
        setPhotoUrl(data.photo_profile_url ?? null)
      } catch (err) {
        setIsError(true)
        setErrorMsg(err?.response?.data?.detail ?? 'Gagal memuat profil.')
      } finally {
        setIsLoading(false)
      }
    }
    const fetchSkills = async () => {
      try {
        const skillsData = await studentService.getGlobalSkills()
        setGlobalSkills(skillsData.map((s) => s.name))
      } catch (err) {
        console.error('Gagal memuat daftar keahlian:', err)
      }
    }
    fetch()
    fetchSkills()
  }, [])

  // ── Faculty change resets major ──
  const handleFacultyChange = (e) => {
    setFaculty(e.target.value)
    setMajor('')
  }

  // ── Skills ──
  const addSkill = () => {
    const trimmed = skillInput.trim()
    if (!trimmed || skills.includes(trimmed)) return
    setSkills((prev) => [...prev, trimmed])
    setSkillInput('')
  }

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill() }
  }

  // ── CV ──
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) setNewCvFile(file)
  }

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
      let cvId    = profile?.cv_id ?? undefined
      let photoId = profile?.photo_profile_id ?? undefined

      if (newCvFile) {
        const uploaded = await studentService.uploadDocument(newCvFile, 'cv')
        cvId = uploaded.id
        setCvUrl(uploaded.url)
        setNewCvFile(null)
      }

      if (newPhotoFile) {
        const uploaded = await studentService.uploadDocument(newPhotoFile, 'photo')
        photoId = uploaded.id
        setNewPhotoFile(null)
      }

      const payload = {
        full_name:       fullName,
        email:           email,
        nim:             nim,
        faculty:         faculty,
        major:           major,
        gpa:             parseFloat(gpa) || 0,
        graduation_year: parseInt(graduationYear, 10) || 0,
        phone_number:    phoneNumber,
        skills:          skills,
        ...(cvId    && { cv_id: cvId }),
        ...(photoId && { photo_profile_id: photoId }),
      }

      const updated = await studentService.updateProfile(payload)
      setProfile(updated)
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
    <div className="px-8 py-8 max-w-215 mx-auto">
      <ProfileSkeleton />
    </div>
  )

  // ── Error ──
  if (isError) return (
    <div className="px-8 py-8 max-w-215 mx-auto flex flex-col items-center gap-4 mt-16">
      <p className="text-[#1B1B21] text-lg font-semibold">Gagal memuat profil</p>
      <p className="text-[#454651] text-sm">{errorMsg}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-5 py-2 rounded-lg bg-[#4D44B5] text-white text-sm font-medium hover:bg-[#3d369a] transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  )

  // ── Render ──
  return (
    <div className="px-8 py-8 max-w-215 mx-auto flex flex-col gap-6">

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

      {/* ── Data Diri ── */}
      <div className="bg-white rounded-xl border border-[#DBD9E1] p-6 flex flex-col gap-5">

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 rounded-2xl border border-gray-200 bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
            {photoUrl
              ? <img src={photoUrl} alt="Foto profil" className="w-full h-full object-cover" />
              : <span className="text-2xl font-bold text-[#4D44B5]">{fullName?.charAt(0) ?? '?'}</span>
            }
          </div>
          <button
            onClick={() => photoInputRef.current?.click()}
            className="hover:opacity-70 transition-opacity"
            title="Ganti foto profil"
          >
            <EditIcon />
          </button>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => handlePhotoFile(e.target.files?.[0])}
          />
          {newPhotoFile && (
            <span className="text-xs text-[#4D44B5] font-medium">
              {newPhotoFile.name} — simpan untuk menerapkan
            </span>
          )}
        </div>

        <div className="border-b border-[#DBD9E1] pb-1">
          <h2 className="text-[#1B1B21] font-semibold text-xl leading-7">Data Diri</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Nama Lengkap">
            <TextInput value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </FormField>
          <FormField label="NIM">
            <TextInput value={nim} onChange={(e) => setNim(e.target.value)} />
          </FormField>
          <FormField label="Fakultas">
            <SelectInput
              value={faculty}
              onChange={handleFacultyChange}
              options={IPB_FACULTIES.map((f) => f.name)}
              placeholder="Pilih..."
            />
          </FormField>
          <FormField label="Jurusan">
            <SelectInput
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              options={majorOptions}
              placeholder="Pilih..."
            />
          </FormField>
          <FormField label="IPK">
            <TextInput value={gpa} onChange={(e) => setGpa(e.target.value)} placeholder="contoh: 3.75" />
          </FormField>
          <FormField label="Rencana/Tahun Lulus">
            <TextInput value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} placeholder="contoh: 2027" />
          </FormField>
          <FormField label="Email IPB">
            <TextInput value={email} onChange={(e) => setEmail(e.target.value)} type="email" disabled={true} />
          </FormField>
          <FormField label="Nomor Telepon (WhatsApp)">
            <TextInput value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} type="tel" placeholder="contoh: 08123456789" />
          </FormField>
        </div>
      </div>

      {/* ── Keahlian ── */}
      <div className="bg-white rounded-xl border border-[#DBD9E1] p-6 flex flex-col gap-4">
        <h2 className="text-[#1B1B21] font-semibold text-xl leading-7">Keahlian</h2>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <SkillChip
                key={skill}
                label={skill}
                onRemove={() => setSkills((prev) => prev.filter((s) => s !== skill))}
              />
            ))}
          </div>
        )}
        <div className="flex items-center w-full px-4 py-3.5 rounded-lg border border-[#CBD0E0] bg-white">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder="Tambahkan keahlian, tekan Enter"
            className="flex-1 text-gray-500 text-base outline-none bg-transparent placeholder-gray-400"
            list="global-skills-list"
          />
          <datalist id="global-skills-list">
            {globalSkills.map((skill) => (
              <option key={skill} value={skill} />
            ))}
          </datalist>
          <button onClick={addSkill} className="ml-2 hover:opacity-60 transition-opacity">
            <PlusIcon />
          </button>
        </div>
      </div>

      {/* ── Dokumen ── */}
      <div className="bg-white rounded-xl border border-[#DBD9E1] p-6 flex flex-col gap-3">
        <h2 className="text-[#1B1B21] font-semibold text-xl leading-7">Dokumen</h2>
        <p className="text-[#6B7280] text-sm">Unggah Kurikulum Vitae (CV) terbaru Anda.</p>

        {/* Global hidden file input for CV */}
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          accept=".pdf,.doc,.docx"
          onChange={(e) => { if (e.target.files?.[0]) setNewCvFile(e.target.files[0]) }}
        />

        {newCvFile ? (
          /* State 1: New file selected (ready to save) */
          <div className="flex items-center gap-3 px-3 py-4 rounded-lg border border-[#DBD9E1] bg-[#F8F9FE]">
            <FileIcon />
            <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
              <span className="text-[#1B1B21] font-semibold text-sm truncate">{newCvFile.name}</span>
              <span className="text-[#6B7280] text-xs">
                {(newCvFile.size / (1024 * 1024)).toFixed(1)} MB — belum diunggah
              </span>
            </div>
            <button
              onClick={() => { setNewCvFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
              className="hover:opacity-60 transition-opacity"
            >
              <TrashIcon />
            </button>
          </div>
        ) : cvUrl ? (
          /* State 2: Existing CV on server */
          <div className="flex items-center gap-3 px-3 py-4 rounded-lg border border-[#DBD9E1] bg-[#F8F9FE]">
            <FileIcon />
            <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
              <span className="text-[#1B1B21] font-semibold text-sm truncate">CV Tersimpan</span>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#35299D] text-xs hover:underline truncate"
              >
                Lihat Dokumen Saat Ini
              </a>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[#4D44B5] text-xs font-medium hover:underline shrink-0"
            >
              Ganti File
            </button>
          </div>
        ) : (
          /* State 3: Drop zone (No file) */
          <div
            className={`flex flex-col items-center justify-center gap-4 h-36.75 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${isDragging ? 'border-[#4D44B5] bg-[#E8F0FE]/30' : 'border-gray-300 hover:border-[#4D44B5]'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-13 h-13 rounded-full bg-[#E8F0FE] flex items-center justify-center">
              <UploadIcon />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-[#4D44B5] font-semibold text-sm">Klik untuk memilih file</span>
              <span className="text-[#6B7280] text-sm">atau drag and drop file di sini</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Save ── */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#4D44B5] text-white font-medium text-base hover:bg-[#3d369a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <SaveIcon />
          {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

    </div>
  )
}