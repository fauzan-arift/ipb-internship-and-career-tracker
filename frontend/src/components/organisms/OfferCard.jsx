import React from 'react';
import { MapPin, CheckCircle, XCircle } from 'lucide-react';
import AvatarSquare from '../atoms/AvatarSquare';
import Button from '../atoms/Button';
import DocumentLink from '../molecules/DocumentLink';

const STATUS_CONFIG = {
  Accepted: {
    card: 'bg-green-50 border-green-300',
    banner: 'bg-green-100 border-green-200 text-green-800',
    bannerIcon: CheckCircle,
    bannerIconColor: 'text-green-600',
    bannerMessage: 'Anda telah menerima tawaran ini.',
    badge: 'bg-green-100 text-green-700 border-green-200',
    badgeLabel: 'Diterima',
  },
  Rejected: {
    card: 'bg-red-50 border-red-300',
    banner: 'bg-red-100 border-red-200 text-red-800',
    bannerIcon: XCircle,
    bannerIconColor: 'text-red-500',
    bannerMessage: 'Anda telah menolak tawaran ini.',
    badge: 'bg-red-100 text-red-600 border-red-200',
    badgeLabel: 'Ditolak',
  },
  Pending: {
    card: 'bg-white border-gray-200',
    banner: null,
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeLabel: 'Menunggu Respons',
  },
};

function OfferCard({ offer, onAccept, onReject }) {
  const status = offer?.status ?? 'Pending';
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.Pending;
  const BannerIcon = cfg.bannerIcon;

  return (
    <div className={`rounded-xl border p-6 shadow-sm transition-all duration-300 ${cfg.card}`}>

      {/* Status banner */}
      {cfg.banner && (
        <div className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 mb-4 text-sm font-medium ${cfg.banner}`}>
          <BannerIcon size={15} className={`shrink-0 ${cfg.bannerIconColor}`} />
          {cfg.bannerMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b pb-4 mb-4">
        <div className="flex items-start gap-4">
          <AvatarSquare
            name={offer.companyInitial}
            imageUrl={offer.companyLogoUrl}
            bg="#1A1A1A"
            color="#FFFFFF"
            size={56}
          />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{offer.position}</h2>
            <p className="text-gray-600">{offer.companyName}</p>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <MapPin size={14} />
              <span>{offer.location}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {/* Status badge */}
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${cfg.badge}`}>
            {cfg.badgeLabel}
          </span>
          <div className="text-right">
            <span className="text-xs text-gray-400">Batas Waktu:</span>
            <p className="text-red-600 font-semibold text-sm">{offer.deadline}</p>
          </div>
        </div>
      </div>

      {/* Detail */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Detail Offering</h3>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          <div>
            <span className="text-gray-500 text-xs uppercase">Tanggal Penawaran</span>
            <p className="font-medium text-gray-800">{offer.offerDate}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs uppercase">Durasi Magang</span>
            <p className="font-medium text-gray-800">{offer.duration}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs uppercase">Uang Saku / Kompensasi</span>
            <p className="font-medium text-gray-800">{offer.salary}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs uppercase">Dokumen Offering</span>
            <DocumentLink
              fileName={offer.documentName}
              fileUrl={offer.documentUrl}
            />
          </div>
        </div>
      </div>

      {/* Company message */}
      <div className="bg-[#F8F9FA] p-4 rounded-lg border border-gray-100 mb-6">
        <h4 className="font-semibold text-gray-800 mb-1">Pesan dari Perusahaan</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{offer.companyMessage}</p>
      </div>

      {/* Actions — hidden once decided */}
      {status === 'Pending' && (
        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="secondary" onClick={() => onReject(offer.id)}>
            Tolak Offering
          </Button>
          <Button variant="primary" onClick={() => onAccept(offer.id)}>
            Terima Offering
          </Button>
        </div>
      )}

    </div>
  );
}

export default OfferCard;