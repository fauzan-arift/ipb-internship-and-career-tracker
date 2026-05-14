import React from 'react';
import StatCard from '../molecules/StatCard';

function DashboardStatsRow({ stats }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}

export default DashboardStatsRow;