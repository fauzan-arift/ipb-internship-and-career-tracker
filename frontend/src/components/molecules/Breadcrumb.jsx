import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500" aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {isLast ? (
              <span className="text-gray-900 font-medium">{item.label}</span>
            ) : (
              <Link to={item.href} className="hover:text-indigo-600 transition-colors">
                {item.label}
              </Link>
            )}
            {!isLast && <ChevronRight size={16} className="text-gray-400" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;