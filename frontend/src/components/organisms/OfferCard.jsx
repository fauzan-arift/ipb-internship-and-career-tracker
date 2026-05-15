import React from 'react';
import { MapPin } from 'lucide-react';
import AvatarSquare from '../atoms/AvatarSquare';
import Button from '../atoms/Button';
import DocumentLink from '../molecules/DocumentLink';

function OfferCard({ offer, onAccept, onReject }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b pb-4 mb-4">
        <div className="flex items-start gap-4">
          <AvatarSquare 
            name={offer.companyInitial} 
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
        <div className="text-right flex-shrink-0">
          <span className="text-xs text-gray-400">Batas Waktu:</span>
          <p className="text-red-600 font-semibold text-sm">{offer.deadline}</p>
        </div>
      </div>

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

      <div className="bg-[#F8F9FA] p-4 rounded-lg border border-gray-100 mb-6">
        <h4 className="font-semibold text-gray-800 mb-1">Pesan dari Perusahaan</h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {offer.companyMessage}
        </p>
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button 
          variant="secondary" 
          onClick={() => onReject(offer.id)}
        >
          Tolak Offering
        </Button>
        <Button 
          variant="primary" 
          onClick={() => onAccept(offer.id)}
        >
          Terima Offering
        </Button>
      </div>

    </div>
  );
}

export default OfferCard;