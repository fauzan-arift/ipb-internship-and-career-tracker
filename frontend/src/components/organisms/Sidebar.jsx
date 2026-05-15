import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  {
    label: "Lowongan Magang",
    href: "/internship",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12H12.01M16 6V4C16 3.46957 15.7893 2.96086 15.4142 2.58579C15.0391 2.21071 14.5304 2 14 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4V6M22 13C19.0328 14.959 15.5555 16.0033 12 16.0033C8.44445 16.0033 4.96721 14.959 2 13M4 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V8C2 6.89543 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Lamaran Saya",
    href: "/lamaran",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8M12 11H16M12 16H16M8 11H8.01M8 16H8.01M9 2H15C15.5523 2 16 2.44772 16 3V5C16 5.55228 15.5523 6 15 6H9C8.44772 6 8 5.55228 8 5V3C8 2.44772 8.44772 2 9 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Tawaran Lowongan",
    href: "/tawaran",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 17L13 19C13.197 19.197 13.4308 19.3533 13.6882 19.4599C13.9456 19.5665 14.2214 19.6213 14.5 19.6213C14.7786 19.6213 15.0544 19.5665 15.3118 19.4599C15.5692 19.3533 15.803 19.197 16 19C16.197 18.803 16.3532 18.5692 16.4598 18.3118C16.5665 18.0544 16.6213 17.7786 16.6213 17.5C16.6213 17.2214 16.5665 16.9456 16.4598 16.6882C16.3532 16.4309 16.197 16.197 16 16M14 14L16.5 16.5C16.8978 16.8978 17.4374 17.1213 18 17.1213C18.5626 17.1213 19.1022 16.8978 19.5 16.5C19.8978 16.1022 20.1213 15.5626 20.1213 15C20.1213 14.4374 19.8978 13.8978 19.5 13.5L15.62 9.62002C15.0575 9.05821 14.295 8.74265 13.5 8.74265C12.705 8.74265 11.9425 9.05821 11.38 9.62002L10.5 10.5C10.1022 10.8978 9.56261 11.1213 9 11.1213C8.43739 11.1213 7.89782 10.8978 7.5 10.5C7.10218 10.1022 6.87868 9.56262 6.87868 9.00002C6.87868 8.43741 7.10218 7.89784 7.5 7.50002L10.31 4.69002C11.2222 3.78016 12.4119 3.20057 13.6906 3.04299C14.9694 2.88541 16.2642 3.15885 17.37 3.82002L17.84 4.10002C18.2658 4.357 18.772 4.44613 19.26 4.35002L21 4.00002M21 3.00002L22 14H20M3 3.00002L2 14L8.5 20.5C8.89782 20.8978 9.43739 21.1213 10 21.1213C10.5626 21.1213 11.1022 20.8978 11.5 20.5C11.8978 20.1022 12.1213 19.5626 12.1213 19C12.1213 18.4374 11.8978 17.8978 11.5 17.5M3 4.00002H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Career Mapping",
    href: "/career",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.71406 14H5.00406C4.79439 14.0001 4.59005 14.0661 4.41994 14.1886C4.24982 14.3112 4.12253 14.4841 4.05606 14.683L2.05206 20.683C2.00182 20.8333 1.98803 20.9934 2.01182 21.1501C2.03561 21.3068 2.0963 21.4556 2.18888 21.5842C2.28147 21.7128 2.40331 21.8176 2.54434 21.8899C2.68538 21.9622 2.84158 21.9999 3.00006 22H21.0001C21.1584 21.9999 21.3145 21.9621 21.4554 21.8899C21.5964 21.8177 21.7181 21.713 21.8107 21.5845C21.9033 21.456 21.964 21.3074 21.9879 21.1508C22.0118 20.9942 21.9981 20.8343 21.9481 20.684L19.9481 14.684C19.8817 14.4848 19.7543 14.3115 19.584 14.1888C19.4137 14.066 19.209 13.9999 18.9991 14H15.2871M18.0001 8C18.0001 11.613 14.1311 15.429 12.6071 16.795C12.4327 16.9282 12.2194 17.0003 12.0001 17.0003C11.7807 17.0003 11.5674 16.9282 11.3931 16.795C9.87006 15.429 6.00006 11.613 6.00006 8C6.00006 6.4087 6.6322 4.88258 7.75742 3.75736C8.88264 2.63214 10.4088 2 12.0001 2C13.5914 2 15.1175 2.63214 16.2427 3.75736C17.3679 4.88258 18.0001 6.4087 18.0001 8ZM14.0001 8C14.0001 9.10457 13.1046 10 12.0001 10C10.8955 10 10.0001 9.10457 10.0001 8C10.0001 6.89543 10.8955 6 12.0001 6C13.1046 6 14.0001 6.89543 14.0001 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Logbook",
    href: "/logbook",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.4 2.00015H6C5.46957 2.00015 4.96086 2.21086 4.58579 2.58594C4.21071 2.96101 4 3.46972 4 4.00015V20.0001C4 20.5306 4.21071 21.0393 4.58579 21.4144C4.96086 21.7894 5.46957 22.0001 6 22.0001H18C18.5304 22.0001 19.0391 21.7894 19.4142 21.4144C19.7893 21.0393 20 20.5306 20 20.0001V12.6001M2 6.00015H6M2 10.0001H6M2 14.0001H6M2 18.0001H6M21.378 5.62615C21.7764 5.22779 22.0001 4.68751 22.0001 4.12415C22.0001 3.56079 21.7764 3.0205 21.378 2.62215C20.9796 2.22379 20.4394 2 19.876 2C19.3126 2 18.7724 2.22379 18.374 2.62215L13.364 7.63415C13.1262 7.87177 12.9522 8.16548 12.858 8.48815L12.021 11.3581C11.9959 11.4442 11.9944 11.5354 12.0166 11.6222C12.0389 11.7091 12.0841 11.7883 12.1474 11.8517C12.2108 11.9151 12.2901 11.9603 12.3769 11.9825C12.4637 12.0048 12.555 12.0032 12.641 11.9781L15.511 11.1411C15.8337 11.0469 16.1274 10.8729 16.365 10.6351L21.378 5.62615Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Profil",
    href: "/profile",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 21C1.99986 19.7062 2.31352 18.4316 2.91408 17.2857C3.51464 16.1397 4.38419 15.1565 5.44815 14.4203C6.51212 13.6842 7.73876 13.217 9.02288 13.059C10.307 12.901 11.6103 13.0568 12.821 13.513M21.378 16.626C21.7764 16.2276 22.0001 15.6874 22.0001 15.124C22.0001 14.5606 21.7764 14.0204 21.378 13.622C20.9796 13.2236 20.4394 12.9999 19.876 12.9999C19.3126 12.9999 18.7724 13.2236 18.374 13.622L14.364 17.634C14.1262 17.8716 13.9522 18.1653 13.858 18.488L13.021 21.358C12.9959 21.444 12.9944 21.5353 13.0166 21.6221C13.0389 21.7089 13.0841 21.7882 13.1474 21.8516C13.2108 21.9149 13.2901 21.9601 13.3769 21.9824C13.4637 22.0046 13.555 22.0031 13.641 21.978L16.511 21.141C16.8337 21.0468 17.1274 20.8728 17.365 20.635L21.378 16.626ZM15 8C15 10.7614 12.7614 13 10 13C7.23858 13 5 10.7614 5 8C5 5.23858 7.23858 3 10 3C12.7614 3 15 5.23858 15 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

/**
 * Sidebar collapsible untuk halaman mahasiswa
 *
 * Props:
 * - activeMenu: string (opsional) — label menu yang aktif, e.g. "Lowongan Magang"
 *   Kalau tidak diisi, aktif ditentukan otomatis dari URL (location.pathname)
 */
export default function Sidebar({ activeMenu }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-16 bottom-0 bg-white border-r border-gray-100 z-40
          flex flex-col transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-60'}
        `}
      >
        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm absolute -right-4 top-6 z-50 hover:bg-gray-50 transition-colors"
          title={collapsed ? 'Buka sidebar' : 'Tutup sidebar'}
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-300 ${collapsed ? 'rotate-0' : 'rotate-180'}`}
          >
            <path d="M15 18L9 12L15 6" stroke="#4D44B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Nav items */}
        <nav className="flex flex-col py-5 overflow-hidden">
          {navItems.map((item) => {
            const isActive = activeMenu
              ? activeMenu === item.label
              : location.pathname === item.href || location.pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                to={item.href}
                title={collapsed ? item.label : undefined}
                className={`
                  flex items-center gap-3 py-3 transition-all duration-200 border-l-4 whitespace-nowrap
                  ${collapsed ? 'px-4 justify-center' : 'px-4'}
                  ${isActive
                    ? 'border-[#4D44B5] bg-[#E8F0FE] text-[#4D44B5]'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700'}
                `}
              >
                {/* Icon — warna ikut state aktif */}
                <span className={`flex-shrink-0 ${isActive ? 'text-[#4D44B5]' : 'text-gray-400'}`}>
                  {item.icon}
                </span>

                {/* Label — sembunyikan saat collapsed */}
                {!collapsed && (
                  <span className="text-sm font-medium leading-5 transition-opacity duration-200">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Spacer — dorong konten ke kanan sesuai lebar sidebar */}
      <div className={`flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`} />
    </>
  );
}