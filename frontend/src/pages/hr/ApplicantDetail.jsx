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
import { useHrApplicationStatus } from '@/hooks/useHrApplicationStatus';
import StatusUpdateModal from '@/components/organisms/StatusUpdateModal';
import ConfirmationDialog from '@/components/organisms/ConfirmationDialog';
import Breadcrumb from '@/components/molecules/Breadcrumb';
import FileViewRow from '@/components/molecules/FileViewRow';

function TimelineProgress({ timeline }) {
  if (!timeline || timeline.length === 0) {
    return <div className="text-sm text-gray-400">Belum ada riwayat status.</div>;
  }

  return (
    <div className="flex flex-col">
      {timeline.map((item, index) => {
        const isCompleted = item.status === 'completed';
        const isInProgress = item.status === 'in-progress';
        const isPending = item.status === 'pending';
        const isCancelled = item.status === 'cancelled';
        const isRejected = item.status === 'rejected';
        const isAccepted = item.status === 'accepted';

        let dotColor = 'bg-gray-300';
        let lineColor = 'bg-gray-200';
        let textColor = 'text-gray-400';

        if (isCompleted || isAccepted) {
          dotColor = 'bg-emerald-500';
          lineColor = 'bg-emerald-500';
          textColor = 'text-gray-900';
        } else if (isInProgress) {
          dotColor = 'bg-amber-500';
          lineColor = 'bg-amber-500';
          textColor = 'text-gray-900';
        } else if (isCancelled || isRejected) {
          dotColor = 'bg-red-500';
          lineColor = 'bg-red-500';
          textColor = 'text-gray-900';
        }

        return (
          <div key={index} className="relative flex gap-4 pb-6 last:pb-0">
            {index < timeline.length - 1 && (
              <div className={`absolute left-[11px] top-5 bottom-0 w-0.5 ${lineColor}`} />
            )}
            <div className={`w-5 h-5 rounded-full ${dotColor} flex-shrink-0 relative z-10 border-2 border-white shadow-sm`} />
            <div className="flex-1 pt-2">
              <div className={`font-semibold text-sm ${textColor}`}>{item.stage}</div>
              <div className="text-xs text-gray-500 mt-2">
                {item.date ? new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ApplicantDetail() {
  const { applicant_id } = useParams();
  const navigate = useNavigate();
  const { application, loading, usingDummy, refetch } = useHrApplication(applicant_id);
  const {
    isOpen,
    openModal,
    closeModal,
    selectedStatus,
    handleStatusSelect,
    saveStatus,
    isSaving,
    error,
    isStatusSelected,
    statuses,
    confirmation,
    closeConfirmation,
  } = useHrApplicationStatus(applicant_id, application?.status, refetch);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Memuat detail lamaran...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Data tidak ditemukan.
      </div>
    );
  }

  if (usingDummy) {
    console.info('Menggunakan data dummy untuk aplikasi ini (API belum tersedia).');
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

  return (
    <div className="flex flex-col gap-6 p-0">
      <Breadcrumb
        items={[
          { label: 'Daftar Pelamar', href: '/hr/applicants' },
          { label: 'Detail Pelamar' },
        ]}
      />

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-inter">
            {student.full_name}
          </h1>
          <div className="text-gray-600 mt-1">
            {student.major} • {student.faculty}
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          <Button 
            variant="primary" 
            onClick={openModal}
            disabled={['Ditawarkan', 'Diterima'].includes(application.status)}
            className={`flex items-center gap-2 ${['Ditawarkan', 'Diterima'].includes(application.status) ? 'opacity-50 cursor-not-allowed bg-gray-400 border-none' : ''}`}
          >
            <Edit2 size={16} /> Ubah Status
          </Button>
          {['Ditawarkan', 'Diterima', 'Ditolak'].includes(application.status) ? (
            <Button 
              variant="outline"
              disabled
              className="flex items-center gap-2 cursor-not-allowed text-gray-500 border-gray-200 bg-gray-50"
            >
              Offering Sudah Dibuat
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={() => navigate(`/hr/applicant/${application.id}/offer`)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <PlusCircle size={16} /> Kasih Offering 
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
              <FileText size={20} className="text-gray-500" />
              Dokumen CV
            </h2>
            <FileViewRow
              fileName={cvDocument.name}
              fileSize={cvDocument.size}
              uploadedAt={cvDocument.uploadedDate}
              href={cvDocument.url}
            />
          </div>

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

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
              <Briefcase size={20} className="text-gray-500" />
              Informasi Lamaran
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Posisi Dilamar
                </div>
                <div className="text-base font-semibold text-gray-900">
                  {application.position || 'Posisi tidak diketahui'}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
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

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h4 className="text-base font-bold text-gray-900 mb-4">
              Timeline Progress
            </h4>
            <TimelineProgress timeline={application.status_history || []} />
          </div>
        </div>
      </div>

      <StatusUpdateModal
        isOpen={isOpen}
        onClose={closeModal}
        statuses={statuses}
        currentStatus={application.status}
        selectedStatus={selectedStatus}
        onSelect={handleStatusSelect}
        onSave={saveStatus}
        isSaving={isSaving}
        isStatusSelected={isStatusSelected}
        error={error}
      />

      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={confirmation.onConfirm}
        title={confirmation.title}
        message={confirmation.message}
        confirmLabel={confirmation.confirmLabel}
      />
    </div>
  );
}