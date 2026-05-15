import React from 'react';
import { Link } from 'react-router-dom';

function Breadcrumb({ items = [] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {isLast ? (
              <span
                style={{
                  fontSize: '13px',
                  color: '#1A1A2E',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '500',
                }}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                style={{
                  fontSize: '13px',
                  color: '#3D3FA8',
                  fontFamily: 'Inter, sans-serif',
                  textDecoration: 'none',
                }}
              >
                {item.label}
              </Link>
            )}
            {!isLast && (
              <span style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
                ›
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default Breadcrumb;