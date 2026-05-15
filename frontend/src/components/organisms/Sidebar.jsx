import React from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar({ menuItems = [], activeHref }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: '210px',
        minWidth: '210px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #CBD0E0',
        minHeight: 'calc(100vh - 57px)',
        paddingTop: '8px',
        flexShrink: 0,
      }}
    >
      {menuItems.map((item) => {
        const isActive = activeHref === item.href;
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            onClick={() => navigate(item.href)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: isActive ? '600' : '400',
              color: isActive ? '#3D3FA8' : '#6B7280',
              backgroundColor: isActive ? '#EEF0FF' : 'transparent',
              borderLeft: isActive ? '3px solid #3D3FA8' : '3px solid transparent',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = '#F5F5F5';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {Icon && (
              <Icon
                size={18}
                style={{ color: isActive ? '#3D3FA8' : '#9CA3AF', flexShrink: 0 }}
              />
            )}
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;