import { useState, useEffect, useCallback } from 'react';
import { offerService } from '@/services/offerService';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Maps the exact API response shape → OfferCard props
function mapOffer(raw) {
  return {
    id:             raw.id,
    status:         raw.status ?? 'Pending',
    // OfferCard props
    companyInitial: raw.internship?.company_name?.charAt(0).toUpperCase() ?? '?',
    companyName:    raw.internship?.company_name ?? '-',
    position:       raw.internship?.title ?? '-',
    location:       raw.internship?.location ?? '-',
    deadline:       formatDate(raw.expiry_date),
    offerDate:      formatDate(raw.offer_date),
    duration:       raw.duration ?? '-',
    salary:         raw.compensation ?? '-',
    documentName:   'Dokumen Offering',
    documentUrl:    raw.offering_file_url ?? null,
    companyMessage: raw.offer_detail ?? '-',
  };
}

export function useOffers() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await offerService.getOffers();
      const list = data?.offers ?? [];
      setOffers(list.map(mapOffer));
    } catch (err) {
      console.error('[useOffers] fetch error:', err);
      setError(err?.response?.data?.message ?? 'Gagal memuat tawaran. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const acceptOffer = useCallback(async (offerId) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'Accepted' } : o))
    );
    try {
      await offerService.respondOffer(offerId, 'Accepted');
    } catch (err) {
      console.error('[useOffers] accept error:', err);
      setOffers((prev) =>
        prev.map((o) => (o.id === offerId ? { ...o, status: 'Pending' } : o))
      );
      setError(err?.response?.data?.message ?? 'Gagal menerima tawaran. Silakan coba lagi.');
    }
  }, []);

  const rejectOffer = useCallback(async (offerId) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'Rejected' } : o))
    );
    try {
      await offerService.respondOffer(offerId, 'Rejected');
    } catch (err) {
      console.error('[useOffers] reject error:', err);
      setOffers((prev) =>
        prev.map((o) => (o.id === offerId ? { ...o, status: 'Pending' } : o))
      );
      setError(err?.response?.data?.message ?? 'Gagal menolak tawaran. Silakan coba lagi.');
    }
  }, []);

  return { offers, isLoading, error, acceptOffer, rejectOffer, refetch: fetchOffers };
}