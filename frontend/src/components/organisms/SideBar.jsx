import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  FileText, 
  Bell, 
  Map, 
  BookOpen, 
  User 
} from 'lucide-react';

const menuItems = [
  { label: 'Lowongan Magang', icon: Briefcase, path: '/lowongan' },
  { label: 'Lamaran Saya', icon: FileText, path: '/lamaran-saya' },
  { label: 'Tawaran Lowongan', icon: Bell, path: '/tawaran' },
  { label: 'Career Mapping', icon: Map, path: '/career-mapping' },
  { label: 'Logbook', icon: BookOpen, path: '/logbook' },
  { label: 'Profil', icon: User, path: '/profil' },
];

function Sidebar({ activeMenu }) {
  const navigate = useNavigate();

  return (
    <div className="w-60 bg-[#F8F9FE] min-h-[calc(100vh-80px)] border-r border-gray-100 hidden md:block pt-2">
      {menuItems.map((item) => {
        const isActive = activeMenu === item.label;
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`
              flex items-center gap-3 px-6 py-3.5 cursor-pointer text-sm transition-all duration-200
              ${isActive 
                ? 'bg-[#EEF0FF] font-semibold border-l-4' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700 border-l-4 border-transparent'}
            `}
            style={{
              borderColor: isActive ? '#4D44B5' : 'transparent',
              color: isActive ? '#4D44B5' : undefined,
            }}
          >
            <Icon 
              size={18} 
              style={{ color: isActive ? '#4D44B5' : '#9CA3AF' }} 
            />
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;