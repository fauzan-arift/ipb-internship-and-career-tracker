import React from 'react';
import { Check, User, Circle } from 'lucide-react';

function StatusTimelineItem({ title, description, date, state, isLast }) {
  let iconContent;
  let iconBgColor = 'bg-gray-300';

  if (state === 'done') {
    iconContent = <Check size={14} className="text-white" />;
    iconBgColor = 'bg-indigo-600';
  } else if (state === 'active') {
    iconContent = <User size={14} className="text-white" />;
    iconBgColor = 'bg-blue-400';
  } else {
    iconContent = <Circle size={14} className="text-gray-300" />;
    iconBgColor = 'bg-transparent border border-gray-300';
  }

  return (
    <div className="relative flex gap-4 pb-6">
      {!isLast && (
        <div className="absolute left-[11px] top-7 bottom-0 w-0.5 bg-gray-200" />
      )}
      
      <div 
        className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center ${iconBgColor} transition-colors`}
      >
        {iconContent}
      </div>

      <div className="flex-1">
        <h5 className="font-medium text-gray-900">{title}</h5>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        <span className="text-xs text-gray-400 block mt-1">{date}</span>
      </div>
    </div>
  );
}

export default StatusTimelineItem;