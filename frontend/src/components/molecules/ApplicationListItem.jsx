import React from 'react';
import AvatarSquare from '../atoms/AvatarSquare';
import Badge from '../atoms/Badge';

function ApplicationListItem({ logo, position, company, date, status, isActive, onClick }) {
  let badgeVariant = 'gray';
  if (status === 'Diproses') badgeVariant = 'blue';
  if (status === 'Diterima') badgeVariant = 'green';
  if (status === 'Ditolak') badgeVariant = 'red';

  return (
    <div
      onClick={onClick}
      className={`
        flex flex-col p-4 border rounded-lg cursor-pointer transition-all
        ${isActive ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white hover:border-indigo-300'}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-3">
          <AvatarSquare name={logo} bg="#1A1A1A" color="#FFFFFF" size={48} />
          <div>
            <h4 className="font-semibold text-gray-900 text-lg leading-tight">{position}</h4>
            <p className="text-sm text-gray-500">{company}</p>
          </div>
        </div>
        <Badge variant={badgeVariant}>{status}</Badge>
      </div>

      <div className="border-t border-gray-100 my-2"></div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">Dilamar: {date}</span>
        <span className="text-indigo-600 text-sm font-medium cursor-pointer hover:underline">
          Lihat Detail →
        </span>
      </div>
    </div>
  );
}

export default ApplicationListItem;