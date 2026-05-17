import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, CheckCircle, XCircle } from 'lucide-react';
import api from '@/api/axios';
import DetailPageHeader from '@/components/organisms/DetailPageHeader';
import TwoColumnDetailLayout from '@/components/organisms/TwoColumnDetailLayout';
import InfoSectionCard from '@/components/organisms/InfoSectionCard';
import InfoGrid from '@/components/organisms/InfoGrid';
import HRDInfoCard from '@/components/organisms/HRDInfoCard';
import DocumentsCard from '@/components/organisms/DocumentsCard';
import DescriptionBox from '@/components/atoms/DescriptionBox';
import Button from '@/components/atoms/Button';
import ConfirmationDialog from '@/components/organisms/ConfirmationDialog';
import PromptDialog from '@/components/organisms/PromptDialog';

const HRDetail = () => {
  const { hr_profile_id } = useParams();
  const profileId = hr_profile_id;
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectPrompt, setShowRejectPrompt] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/admin/hr/profile/${profileId}`);
        if (res.data && res.data.success === false) {
          setStatus({ type: 'error', msg: res.data.message || res.data.detail || 'Gagal memuat detail HR' });
        } else {
          const payload = res.data?.data ?? res.data;
          setDetail(payload);
        }
      } catch (err) {
        setStatus({ type: 'error', msg: err.response?.data?.detail || 'Gagal memuat detail HR' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [profileId]);

  const handleApprove = async () => {
    setShowApproveConfirm(false);
    setIsProcessing(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await api.post(`/admin/hr/profile/${profileId}/approve`);
      setStatus({ type: 'success', msg: res.data?.message ?? res.data?.detail ?? 'Berhasil diverifikasi' });
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.detail || err.response?.data?.message || 'Gagal menyetujui' });
      setIsProcessing(false);
    }
  };

  const handleReject = async (reason) => {
    setShowRejectPrompt(false);
    if (!reason || reason.trim() === '') return;
    setIsProcessing(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await api.post(`/admin/hr/profile/${profileId}/reject`, { reason });
      setStatus({ type: 'success', msg: res.data?.message ?? res.data?.detail ?? 'Berhasil ditolak' });
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.detail || err.response?.data?.message || 'Gagal menolak' });
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100dvh - 160px)' }}>
        <span style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
          Memuat detail...
        </span>
      </div>
    );
  }

  if (!detail) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100dvh - 160px)' }}>
        <span style={{ fontSize: '14px', color: '#8B1A1A', fontFamily: 'Inter, sans-serif' }}>
          {status.msg}
        </span>
      </div>
    );
  }

  const statusStr = (detail?.hr?.status ?? detail?.status ?? '').toString();
  const isPending = statusStr.toLowerCase() === 'pending';
  const isVerified = statusStr.toLowerCase() === 'verified';

  const infoFields = [
    { label: 'Nama Perusahaan', value: detail.company?.company_name },
    { label: 'Industri', value: detail.company?.industry },
    { label: 'Email Kontak', value: detail.company?.company_email },
    { label: 'No. Telepon HR', value: detail.hr?.phone_number },
    { label: 'Website', value: detail.company?.website },
    { label: 'Alamat Lengkap', value: detail.company?.address },
  ];

  const documents = detail.npwp_document
    ? [
      {
        name: detail.npwp_document.file_name,
        format: `FORMAT ${detail.npwp_document.file_format?.toUpperCase()}`,
        date: `Diunggah: ${detail.npwp_document.upload_date ? new Date(detail.npwp_document.upload_date).toLocaleDateString('id-ID') : '-'}`,
        href: detail.npwp_document.download_url,
      },
    ]
    : [];

  const headerActions = (
    <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
      {isPending ? (
        <>
          <Button
            variant="primary"
            disabled={isProcessing || status.type === 'success'}
            onClick={() => setShowApproveConfirm(true)}
          >
            <CheckCircle size={16} />
            Verifikasi
          </Button>
          <Button
            variant="danger"
            disabled={isProcessing || status.type === 'success'}
            onClick={() => setShowRejectPrompt(true)}
          >
            <XCircle size={16} />
            Tolak
          </Button>
          <ConfirmationDialog
            isOpen={showApproveConfirm}
            onClose={() => setShowApproveConfirm(false)}
            onConfirm={handleApprove}
            title="Verifikasi HR"
            message="Yakin ingin menyetujui HR ini? Email persetujuan akan dikirim."
          />
          <PromptDialog
            isOpen={showRejectPrompt}
            onClose={() => setShowRejectPrompt(false)}
            onSubmit={handleReject}
            title="Alasan Penolakan"
            placeholder="Masukkan alasan penolakan..."
            centered={true}
          />
        </>
      ) : (
        <Button variant="primary" disabled>
          <CheckCircle size={16} />
          {detail.hr?.status?.toUpperCase()}
        </Button>
      )}
    </div>
  );

  const registeredAtRaw = detail.npwp_document?.upload_date ?? detail?.hr?.registered_at ?? detail?.registered_at ?? detail?.company?.registered_at ?? detail?.created_at ?? detail?.hr?.created_at ?? null;

  const registeredAt = registeredAtRaw
    ? new Date(registeredAtRaw).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : '-';

  const badgeLabel = isVerified ? 'Terverifikasi' : 'Belum Diverifikasi';

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {status.msg && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: status.type === 'error' ? '#FDECEA' : '#D6F5E3',
            color: status.type === 'error' ? '#8B1A1A' : '#1A6B3A',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {status.msg}
        </div>
      )}

      <DetailPageHeader
        name={detail.company?.company_name}
        badge={badgeLabel}
        badgeVariant={isVerified ? 'green' : 'yellow'}
        date={registeredAt}
        breadcrumb={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Detail Perusahaan' },
        ]}
        actions={headerActions}
      />

      <TwoColumnDetailLayout
        left={
          <>
            <InfoSectionCard title="Informasi Perusahaan" icon={<Building2 size={18} />}>
              <InfoGrid fields={infoFields} />
              <DescriptionBox label="Deskripsi Perusahaan" value={detail.company?.description} />
            </InfoSectionCard>
            <DocumentsCard documents={documents} />
          </>
        }
        right={
          <HRDInfoCard
            name={detail.hr?.full_name}
            position={detail.hr?.position}
            email={detail.hr?.email}
            phone={detail.hr?.phone_number}
          />
        }
      />
    </div>
  );
};

export default HRDetail;