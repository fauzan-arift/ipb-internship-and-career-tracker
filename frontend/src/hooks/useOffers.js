import { useState, useEffect, useCallback } from 'react';
import { offerService } from '@/services/offerService';

export function useOffers() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await offerService.getOffers();
      console.log('[useOffers] raw response:', data);

      // Handle whatever shape the API returns
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.offers)
        ? data.offers
        : [];

      setOffers(list);
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