import React from 'react';
import TimelineDot from '../atoms/TimelineDot';

function TimelineItem({ label, description, active = false }) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{ paddingTop: '3px' }}>
        <TimelineDot active={active} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: active ? '#1A1A2E' : '#6B7280',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {label}
        </span>
        {description && (
          <span
            style={{
              fontSize: '12px',
              color: '#6B7280',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

export default TimelineItem;