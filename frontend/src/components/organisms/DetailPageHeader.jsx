import React from 'react';
import BackButton from '../atoms/BackButton';
import Badge from '../atoms/Badge';
import AvatarSquare from '../atoms/AvatarSquare';
import Breadcrumb from '../molecules/Breadcrumb';

function DetailPageHeader({ name, badge, badgeVariant, date, onBack, actions, breadcrumb }) {
  return (
    <div>

      {breadcrumb && (
        <Breadcrumb items={breadcrumb} />
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <AvatarSquare name={name || 'N A'} bg="#EEF0FF" color="#3D3FA8" size={56} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#1A1A2E', fontFamily: 'Inter, sans-serif', margin: 0 }}>
              {name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
              {date && (
                <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                  Terdaftar {date}
                </span>
              )}
            </div>
          </div>
        </div>
        {actions && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailPageHeader;