import React, { useState } from 'react';
import OfferCard from '@/components/organisms/OfferCard';
import ConfirmationDialog from '@/components/organisms/ConfirmationDialog';

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

function OffersPage() {
  const [offers, setOffers] = useState(dummyOffers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState({ offerId: null, action: null });

  const handleAction = (offerId, action) => {
    setPendingAction({ offerId, action });
    setDialogOpen(true);
  };

  const confirmAction = () => {
    const { offerId, action } = pendingAction;
    console.log(`User ${action} offer ID ${offerId}`);
    setOffers(prev => prev.filter(o => o.id !== offerId));
    setDialogOpen(false);
    setPendingAction({ offerId: null, action: null });
  };

  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Tawaran Lowongan</h1>

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