import React from 'react';
import StatusTimelineItem from '../molecules/StatusTimelineItem';

function StatusTimeline({ items }) {
    console.log('📦 StatusTimeline items:', items);
  return (
    <div className="relative pl-2">
      {items.map((item, index) => (
        <StatusTimelineItem
          key={index}
          title={item.title}
          description={item.description}
          date={item.date}
          state={item.state}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}

export default StatusTimeline;