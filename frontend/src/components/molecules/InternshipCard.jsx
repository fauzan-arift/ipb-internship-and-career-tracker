import React from 'react';
import { MapPin, Clock } from 'lucide-react';
import Badge from '../atoms/Badge';
import AvatarSquare from '../atoms/AvatarSquare';
import Button from '../atoms/Button';

function InternshipCard({ tags, companyName, companyInitial, position, location, duration, deadline, onDetailClick }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map(tag => {
          let variant = 'gray';
            if (tag === 'WFH') variant = 'teal';
            if (tag === 'WFO') variant = 'indigo';
            if (tag === 'Hybrid') variant = 'yellow';
            if (tag === 'Paid Internship') variant = 'green';
            if (tag === 'Unpaid Internship') variant = 'orange';
          return <Badge key={tag} variant={variant}>{tag}</Badge>;
        })}
      </div>

      <div className="flex items-center gap-4 mb-3">
        <AvatarSquare name={companyInitial} bg="#1A1A1A" color="#FFFFFF" size={48} />
        <div>
          <h3 className="text-[15px] font-bold text-gray-900 leading-snug">{position}</h3>
          <p className="text-xs text-gray-500 font-medium">{companyName}</p>
        </div>
      </div>

      <div className="space-y-2 text-xs text-gray-600 mb-6">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-gray-500" /> 
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-gray-500" /> 
          <span>{duration}</span>
        </div>
      </div>

      <div className="flex justify-between items-center border-t pt-3 border-gray-100">
        <span className="text-[10px] text-gray-400 font-medium">Berakhir {deadline}</span>
        <Button variant="primary" size="sm" onClick={onDetailClick}>
          Lihat Detail →
        </Button>
      </div>
    </div>
  );
}

export default InternshipCard;