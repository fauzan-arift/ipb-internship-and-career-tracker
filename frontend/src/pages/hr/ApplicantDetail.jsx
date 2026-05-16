import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Edit2, 
  PlusCircle, 
  FileText, 
  User, 
  Briefcase 
} from 'lucide-react';
import Button from '@/components/atoms/Button';
import CVDocumentCard from '@/components/molecules/CVDocumentCard';
import StudentInfoCard from '@/components/molecules/StudentInfoCard';
import Badge from '@/components/atoms/Badge';
import { useHrApplication } from '@/hooks/useHrApplication';

// ── Timeline Component ──────────────────────────────────────────────────────
function TimelineProgress({ timeline }) {
  // ... (kode timeline tetap sama seperti sebelumnya)
}

export default function ApplicantDetail() {
  const { application_id } = useParams();
  const navigate = useNavigate();
  const { application, loading, error, updateStatus } = useHrApplication(application_id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Memuat detail lamaran...
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error || 'Data tidak ditemukan'}
      </div>
    );
  }

  const student = application.student || {};
  const statusVariant = {
    'Melamar Posisi': 'yellow',
    'Diproses': 'blue',
    'Diterima': 'green',
    'Ditolak': 'red',
  }[application.status] || 'gray';

  const cvDocument = {
    name: student.cv_url ? student.cv_url.split('/').pop() : 'CV Mahasiswa.pdf',
    size: '1.2 MB',
    uploadedDate: application.application_time,
    url: student.cv_url,
  };

  const handleStatusChange = () => {
    // Implementasi update status (bisa pakai dialog/modal)
    alert('Fitur ubah status akan segera hadir');
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/hr/applicants" className="hover:text-indigo-600 transition-colors">
          Daftar Pelamar
        </Link>
        <ChevronLeft size={14} className="-rotate-90" />
        <span className="text-gray-900 font-medium">Detail Pelamar</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-inter">
            {student.full_name}
          </h1>
          <div className="text-gray-600 mt-1">
            {student.major} • {student.faculty}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button 
            variant="primary" 
            onClick={handleStatusChange}
            className="flex items-center gap-2"
          >
            <Edit2 size={16} /> Ubah Status
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate(`/hr/applications/${application.id}/offer`)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <PlusCircle size={16} /> Kasih Offering →
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dokumen CV */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <FileText size={20} className="text-gray-500" />
              Dokumen CV
            </h2>
            <CVDocumentCard cvDocument={cvDocument} />
          </div>

          {/* Informasi Mahasiswa */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
              <User size={20} className="text-gray-500" />
              Informasi Mahasiswa
            </h2>
            <StudentInfoCard student={{
              fullName: student.full_name,
              nim: student.nim,
              studyProgram: student.major,
              faculty: student.faculty,
              ipk: student.gpa,
              phone: student.phone_number,
              email: student.email,
              skills: student.skills || [],
            }} />
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-6">
          {/* Informasi Lamaran */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
              <Briefcase size={20} className="text-gray-500" />
              Informasi Lamaran
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Posisi Dilamar
                </div>
                <div className="text-base font-semibold text-gray-900">
                  {application.position || 'Posisi tidak diketahui'}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Tanggal Melamar
                </div>
                <div className="text-base font-semibold text-gray-900">
                  {new Date(application.application_time).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Status Saat Ini
                </div>
                <Badge variant={statusVariant}>{application.status}</Badge>
              </div>
            </div>
          </div>

          {/* Timeline Progress */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="text-base font-bold text-gray-900 mb-4">
              Timeline Progress
            </h4>
            <TimelineProgress timeline={application.status_history || []} />
          </div>
        </div>
      </div>
    </div>
  );
}