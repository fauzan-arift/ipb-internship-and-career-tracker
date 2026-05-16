import { useState, useCallback } from 'react';
import { hrApplicationService } from '@/services/hrApplicationService';

const STATUS_FLOW = [
  {
    value: 'Pending',
    label: 'Lamaran Masuk',
    description: 'Lamaran baru masuk, belum dilihat HR',
    automatic: true,
    isFinal: false,
  },
  {
    value: 'Diproses',
    label: 'Diproses',
    description: 'HR membaca lamaran, dalam antrian proses',
    automatic: false,
    isFinal: false,
  },
  {
    value: 'Review HR',
    label: 'Review HR',
    description: 'HR sedang mengevaluasi dokumen/CV secara mendalam',
    automatic: false,
    isFinal: false,
  },
  {
    value: 'Interview',
    label: 'Interview',
    description: 'Kandidat dipanggil wawancara (online/offline)',
    automatic: false,
    isFinal: false,
  },
  {
    value: 'Ditawarkan',
    label: 'Ditawarkan',
    description: 'HR membuat offer letter, menunggu respons kandidat',
    automatic: true,
    isFinal: false,
  },
  {
    value: 'Diterima',
    label: 'Diterima',
    description: 'Kandidat menerima tawaran, magang terkonfirmasi',
    automatic: true,
    isFinal: true,
  },
  {
    value: 'Ditolak',
    label: 'Ditolak',
    description: 'Kandidat tidak diterima (HR reject atau kandidat tolak offer)',
    automatic: false,
    isFinal: true,
  },
];

export function useHrApplicationStatus(applicationId, currentStatus) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const openModal = useCallback(() => {
    setSelectedStatus(currentStatus);
    setIsOpen(true);
    setError(null);
  }, [currentStatus]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedStatus(null);
    setError(null);
  }, []);

  const handleStatusSelect = useCallback((statusValue) => {
    const statusConfig = STATUS_FLOW.find((s) => s.value === statusValue);
    if (!statusConfig) return;

    if (statusConfig.isFinal) {
      const confirm = window.confirm(
        `Apakah Anda yakin ingin mengubah status menjadi "${statusConfig.label}"?\n\nTindakan ini bersifat final dan tidak dapat diubah kembali.`
      );
      if (!confirm) return;
    }

    setSelectedStatus(statusValue);
  }, []);

  const saveStatus = useCallback(async () => {
    if (!selectedStatus || selectedStatus === currentStatus) {
      closeModal();
      return;
    }

    const statusConfig = STATUS_FLOW.find((s) => s.value === selectedStatus);
    if (statusConfig?.isFinal) {
      const confirm = window.confirm(
        `Anda akan mengubah status menjadi "${statusConfig.label}".\n\nTindakan ini bersifat FINAL dan tidak dapat dibatalkan. Lanjutkan?`
      );
      if (!confirm) return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await hrApplicationService.updateStatus(applicationId, selectedStatus);
      closeModal();
      if (window.location.pathname.includes('/hr/applications/')) {
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      setError(err.response?.data?.detail || err.message || 'Gagal mengubah status.');
    } finally {
      setIsSaving(false);
    }
  }, [applicationId, selectedStatus, currentStatus, closeModal]);

  const isStatusSelected = useCallback((statusValue) => {
    if (!selectedStatus) return false;

    const selectedIndex = STATUS_FLOW.findIndex((s) => s.value === selectedStatus);
    const checkIndex = STATUS_FLOW.findIndex((s) => s.value === statusValue);

    const statusConfig = STATUS_FLOW.find((s) => s.value === statusValue);
    if (statusConfig?.automatic && statusConfig.value !== 'Ditolak') {
      return false;
    }

    return checkIndex <= selectedIndex;
  }, [selectedStatus]);

  const getStatusConfig = useCallback((statusValue) => {
    return STATUS_FLOW.find((s) => s.value === statusValue);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    selectedStatus,
    handleStatusSelect,
    saveStatus,
    isSaving,
    error,
    isStatusSelected,
    getStatusConfig,
    statuses: STATUS_FLOW,
  };
}