import { useState, useEffect, useCallback } from 'react';
import { offerService } from '@/services/offerService';

// DUMMY DATA BACKUP (Tetap dipertahankan)
const dummyOffers = [
  {
    id: 'dummy-1',
    companyInitial: 'G',
    companyName: 'Google Indonesia',
    position: 'Software Engineering Intern',
    location: 'Jakarta Selatan, DKI Jakarta',
    deadline: '20 October 2023',
    offerDate: '10 October 2023',
    duration: '6 Bulan (Januari - Juni 2024)',
    salary: 'Rp 4.500.000 / Bulan',
    documentName: 'Surat_Penawaran_Google.pdf',
    documentUrl: '#',
    companyMessage: 'Selamat! Berdasarkan hasil wawancara dan tes teknikal, kami sangat senang untuk menawarkan Anda posisi sebagai Software Engineering Intern di Google Indonesia.'
  },
];

// Helper: format date ke string
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

export function useOffers(statusFilter = 'Pending') {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useDummy, setUseDummy] = useState(false);

  const fetchOffers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setUseDummy(false);

    try {
      // 1. Panggil API baru
      const data = await offerService.getOffers(statusFilter);
      const apiOffers = data.offers || [];

      if (apiOffers.length === 0) {
        // Jika data API kosong, fallback ke dummy
        setOffers(dummyOffers);
        setUseDummy(true);
      } else {
        // 2. Mapping data API ke format yang dibutuhkan OfferCard
        const mappedOffers = apiOffers.map((item) => {
          const companyName = item.internship?.company_name || 'Perusahaan Tidak Diketahui';
          const companyInitial = companyName
            .split(' ')
            .slice(0, 2)
            .map((w) => w[0].toUpperCase())
            .join('') || '?';

          return {
            id: item.id,
            companyInitial: companyInitial,
            companyName: companyName,
            position: item.internship?.title || 'Posisi Tidak Diketahui',
            location: item.internship?.location || 'Lokasi tidak tersedia',
            deadline: formatDate(item.expiry_date),
            offerDate: formatDate(item.offer_date),
            duration: item.duration || '-',
            salary: item.compensation || '-',
            documentName: item.offering_file_url
              ? item.offering_file_url.split('/').pop() || 'Dokumen Offering.pdf'
              : 'Dokumen Offering.pdf',
            documentUrl: item.offering_file_url || '#',
            companyMessage: item.offer_detail || 'Tidak ada pesan dari perusahaan.',
          };
        });
        setOffers(mappedOffers);
      }
    } catch (err) {
      console.error('Failed to fetch offers:', err);
      setError(err.message || 'Gagal memuat tawaran lowongan.');
      // Fallback ke dummy jika API gagal
      setOffers(dummyOffers);
      setUseDummy(true);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  const acceptOffer = useCallback((offerId) => {
    // Logic API accept (bisa ditambahkan nanti)
    console.log(`Accept offer ${offerId}`);
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
  }, []);

  const rejectOffer = useCallback((offerId) => {
    // Logic API reject (bisa ditambahkan nanti)
    console.log(`Reject offer ${offerId}`);
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  return {
    offers,
    isLoading,
    error,
    isUsingDummy: useDummy,
    refresh: fetchOffers,
    acceptOffer,
    rejectOffer,
  };
}