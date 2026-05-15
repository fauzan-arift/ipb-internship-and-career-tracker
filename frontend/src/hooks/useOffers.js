import { useState, useEffect, useCallback } from 'react';
import { offerService } from '@/services/offerService';

const dummyOffers = [
  {
    id: 1,
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

const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

export function useOffers() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useDummy, setUseDummy] = useState(false);

  const fetchOffers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setUseDummy(false);

    try {
      const listData = await offerService.listApplications();
      const applications = listData.applications || [];

      if (applications.length === 0) {
        setOffers(dummyOffers);
        setUseDummy(true);
        setIsLoading(false);
        return;
      }

      const offerPromises = applications.map(async (app) => {
        try {
          const detail = await offerService.getApplicationDetail(app.id);
          if (detail.offer && detail.offer.id) {
            const companyName = detail.internship?.company?.company_name || 'Perusahaan Tidak Diketahui';
            const companyInitial = companyName
              .split(' ')
              .slice(0, 2)
              .map(w => w[0].toUpperCase())
              .join('') || '?';
            
            return {
              id: detail.offer.id,
              applicationId: detail.id,
              companyInitial: companyInitial,
              companyName: companyName,
              position: detail.internship?.title || 'Posisi Tidak Diketahui',
              location: '-',
              deadline: formatDate(detail.offer.expiry_date),
              offerDate: formatDate(detail.offer.offer_date),
              duration: detail.offer.duration || '-',
              salary: detail.offer.compensation || '-',
              documentName: detail.offer.offering_file_url 
                ? detail.offer.offering_file_url.split('/').pop() || 'Dokumen Offering.pdf'
                : 'Dokumen Offering.pdf',
              documentUrl: detail.offer.offering_file_url || '#',
              companyMessage: detail.offer.offer_detail || 'Tidak ada pesan dari perusahaan.',
            };
          }
          return null;
        } catch (err) {
          console.warn(`Gagal mengambil detail aplikasi ${app.id}:`, err);
          return null;
        }
      });

      const offerResults = await Promise.all(offerPromises);
      const validOffers = offerResults.filter(offer => offer !== null);

      if (validOffers.length > 0) {
        setOffers(validOffers);
      } else {
        setOffers(dummyOffers);
        setUseDummy(true);
      }

    } catch (err) {
      console.error('Failed to fetch offers:', err);
      setError(err.message || 'Gagal memuat tawaran lowongan.');
      setOffers(dummyOffers);
      setUseDummy(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const acceptOffer = useCallback((offerId) => {
    setOffers(prev => prev.filter(o => o.id !== offerId));
  }, []);

  const rejectOffer = useCallback((offerId) => {
    setOffers(prev => prev.filter(o => o.id !== offerId));
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