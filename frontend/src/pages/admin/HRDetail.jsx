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

const HRDetail = () => {
  const { hr_profile_id } = useParams();
  const profileId = hr_profile_id;
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/admin/hr/profile/${profileId}`);
        if (res.data.success) {
          setDetail(res.data.data);
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
    if (!window.confirm('Yakin ingin menyetujui HR ini? Email persetujuan akan dikirim.')) return;
    setIsProcessing(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await api.post(`/admin/hr/profile/${profileId}/approve`);
      setStatus({ type: 'success', msg: res.data.message });
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.detail || 'Gagal menyetujui' });
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt('Alasan penolakan (akan dikirim via email):');
    if (!reason || reason.trim() === '') return;
    setIsProcessing(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await api.post(`/admin/hr/profile/${profileId}/reject`, { reason });
      setStatus({ type: 'success', msg: res.data.message });
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.detail || 'Gagal menolak' });
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

  const isPending = detail.hr?.status?.toLowerCase() === 'pending';
  const isVerified = detail.hr?.status?.toLowerCase() === 'verified';

  const infoFields = [
    { label: 'Nama Perusahaan', value: detail.company?.company_name },
    { label: 'Industri', value: detail.company?.industry },
    { label: 'Email Kontak', value: detail.company?.company_email },
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
    <div style={{ display: 'flex', gap: '10px' }}>
      {isPending ? (
        <>
          <Button
            variant="primary"
            disabled={isProcessing || status.type === 'success'}
            onClick={handleApprove}
          >
            <CheckCircle size={16} />
            Verifikasi
          </Button>
          <Button
            variant="danger"
            disabled={isProcessing || status.type === 'success'}
            onClick={handleReject}
          >
            <XCircle size={16} />
            Tolak
          </Button>
        </>
      ) : (
        <Button variant="primary" disabled>
          <CheckCircle size={16} />
          {detail.hr?.status?.toUpperCase()}
        </Button>
      )}
    </div>
  );

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
        badge={isVerified ? 'Terverifikasi' : 'Belum Diverifikasi'}
        badgeVariant={isVerified ? 'green' : 'yellow'}
        date={detail.hr?.registered_at
          ? new Date(detail.hr.registered_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
          : '-'
        }
        onBack={() => navigate('/admin/dashboard')}
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
            phone={detail.hr?.phone}
          />
        }
      />
    </div>
  );
};

export default HRDetail;