import React, { useState } from 'react';
import OfferCard from '@/components/organisms/OfferCard';
import ConfirmationDialog from '@/components/organisms/ConfirmationDialog';
import { useOffers } from '@/hooks/useOffers';



const Shimmer = ({ className = '', style = {} }) => (
  <div
    className={`relative overflow-hidden bg-gray-100 rounded ${className}`}
    style={{ isolation: 'isolate', ...style }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
        animation: 'shimmer 1.6s infinite',
      }}
    />
    <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
  </div>
);

const OfferCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-5">

    <div className="flex items-center gap-4">
      <Shimmer className="w-14 h-14 rounded-xl flex-shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <Shimmer className="h-4 w-52 rounded-full" />
        <Shimmer className="h-3 w-36 rounded-full" />
      </div>
      <Shimmer className="h-7 w-24 rounded-full flex-shrink-0" />
    </div>

    <div className="border-t border-gray-100" />


    <div className="grid grid-cols-2 gap-4">
      {[['w-16', 'w-32'], ['w-20', 'w-28'], ['w-14', 'w-36'], ['w-18', 'w-24']].map(([lw, vw], i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <Shimmer className={`h-3 ${lw} rounded-full`} />
          <Shimmer className={`h-3.5 ${vw} rounded-full`} />
        </div>
      ))}
    </div>

    <div className="border-t border-gray-100" />


    <div className="flex flex-col gap-2">
      <Shimmer className="h-3 w-28 rounded-full" />
      <div className="flex flex-col gap-1.5 mt-1">
        {['100%', '91.67%', '83.33%', '100%', '66.67%'].map((w, i) => (
          <Shimmer key={i} className="h-3 rounded-full" style={{ width: w }} />
        ))}
      </div>
    </div>


    <div className="flex gap-3 pt-1">
      <Shimmer className="h-10 flex-1 rounded-lg" />
      <Shimmer className="h-10 flex-1 rounded-lg" />
    </div>
  </div>
);

const OffersPageSkeleton = () => (
  <div className="h-full p-0">
    <Shimmer className="h-7 w-44 rounded-full mb-6" />
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <OfferCardSkeleton key={i} />
      ))}
    </div>
  </div>
);



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
    return <OffersPageSkeleton />;
  }

  if (error && offers.length === 0) {
    return (
      <div className="h-full p-0">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Tawaran Lowongan</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 flex items-center justify-between gap-4">
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
    <div className="h-full p-0">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Tawaran Lowongan</h1>


      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 flex items-center justify-between gap-4">
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
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500">
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