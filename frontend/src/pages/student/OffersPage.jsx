import React, { useState } from 'react';
import OfferCard from '@/components/organisms/OfferCard';
import ConfirmationDialog from '@/components/organisms/ConfirmationDialog';
import { useOffers } from '@/hooks/useOffers';

function OffersPage() {
  const { offers, isLoading, error, acceptOffer, rejectOffer, refetch } = useOffers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState({ offerId: null, action: null });

  const handleAction = (offerId, action) => {
    setPendingAction({ offerId, action });
    setDialogOpen(true);
  };

  const confirmAction = async () => {
    const { offerId, action } = pendingAction;
    if (action === 'accept') {
      await acceptOffer(offerId);
    } else {
      await rejectOffer(offerId);
    }
    setDialogOpen(false);
    setPendingAction({ offerId: null, action: null });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Memuat tawaran lowongan...
      </div>
    );
  }

  if (error && offers.length === 0) {
    return (
      <div className="h-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Tawaran Lowongan</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 flex items-center justify-between gap-4">
          <span className="text-sm">{error}</span>
          <button
            onClick={refetch}
            className="shrink-0 text-sm font-medium underline text-red-600 hover:text-red-800"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Tawaran Lowongan</h1>

      {/* Non-fatal error (e.g. accept/reject failed) */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-5 flex items-center justify-between gap-4">
          <span className="text-sm">{error}</span>
          <button
            onClick={refetch}
            className="shrink-0 text-sm font-medium underline text-red-600 hover:text-red-800"
          >
            Coba lagi
          </button>
        </div>
      )}

      {offers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          Tidak ada tawaran lowongan saat ini.
        </div>
      ) : (
        <div className="space-y-6">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onAccept={(id) => handleAction(id, 'accept')}
              onReject={(id) => handleAction(id, 'reject')}
            />
          ))}
        </div>
      )}

      <ConfirmationDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmAction}
        title={pendingAction.action === 'accept' ? 'Terima Offering' : 'Tolak Offering'}
        message={
          pendingAction.action === 'accept'
            ? 'Apakah Anda yakin ingin menerima tawaran ini?'
            : 'Apakah Anda yakin ingin menolak tawaran ini?'
        }
      />
    </div>
  );
}

export default OffersPage;