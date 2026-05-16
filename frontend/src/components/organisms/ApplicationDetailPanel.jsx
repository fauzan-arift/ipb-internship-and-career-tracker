import React from 'react';
import AvatarSquare from '../atoms/AvatarSquare';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import StatusTimeline from './StatusTimeline';

function ApplicationDetailPanel({ application }) {
  if (!application) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 h-full">
        Pilih lamaran untuk melihat detail
      </div>
    );
  }

  let badgeVariant = 'gray';
  if (application.status === 'Diproses') badgeVariant = 'blue';
  if (application.status === 'Diterima') badgeVariant = 'green';
  if (application.status === 'Ditolak') badgeVariant = 'red';

  const timelineItems = application.status_history ? [...application.status_history].reverse() : [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-full flex flex-col">
      
      <div className="flex flex-row items-center gap-4 border-b pb-6 shrink-0">
        <AvatarSquare
          name={application.logo}
          imageSrc={application.companyPhotoUrl}
          alt={application.company}
          bg="#1A1A1A"
          color="#FFFFFF"
          size={64}
        />
        <div className="flex flex-col gap-1">
          <h4 className="text-lg font-bold">{application.position}</h4>
          <p className="text-sm text-gray-500">{application.company}</p>
          <div className="w-fit">
            <Badge variant={badgeVariant}>{application.status}</Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 py-6 overflow-y-auto" style={{ paddingBottom: '0px' }}>
        <StatusTimeline items={timelineItems} />
      </div>
    </div>
  );
}

export default ApplicationDetailPanel;