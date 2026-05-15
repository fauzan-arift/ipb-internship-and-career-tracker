import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// ─── Icons ────────────────────────────────────────────────────────────────────

const BriefcaseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12H12.01M16 6V4C16 3.46957 15.7893 2.96086 15.4142 2.58579C15.0391 2.21071 14.5304 2 14 2H10C9.46957 2 8.96086 2.21071 8.58579 2.58579C8.21071 2.96086 8 3.46957 8 4V6M22 13C19.0328 14.959 15.5555 16.0033 12 16.0033C8.44445 16.0033 4.96721 14.959 2 13M4 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V8C2 6.89543 2.89543 6 4 6Z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClipboardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8M12 11H16M12 16H16M8 11H8.01M8 16H8.01M9 2H15C15.5523 2 16 2.44772 16 3V5C16 5.55228 15.5523 6 15 6H9C8.44772 6 8 5.55228 8 5V3C8 2.44772 8.44772 2 9 2Z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HandshakeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 17L13 19C13.197 19.197 13.4308 19.3533 13.6882 19.4599C13.9456 19.5665 14.2214 19.6213 14.5 19.6213C14.7786 19.6213 15.0544 19.5665 15.3118 19.4599C15.5692 19.3533 15.803 19.197 16 19C16.197 18.803 16.3532 18.5692 16.4598 18.3118C16.5665 18.0544 16.6213 17.7786 16.6213 17.5C16.6213 17.2214 16.5665 16.9456 16.4598 16.6882C16.3532 16.4309 16.197 16.197 16 16M14 14L16.5 16.5C16.8978 16.8978 17.4374 17.1213 18 17.1213C18.5626 17.1213 19.1022 16.8978 19.5 16.5C19.8978 16.1022 20.1213 15.5626 20.1213 15C20.1213 14.4374 19.8978 13.8978 19.5 13.5L15.62 9.62002C15.0575 9.05821 14.295 8.74265 13.5 8.74265C12.705 8.74265 11.9425 9.05821 11.38 9.62002L10.5 10.5C10.1022 10.8978 9.56261 11.1213 9 11.1213C8.43739 11.1213 7.89782 10.8978 7.5 10.5C7.10218 10.1022 6.87868 9.56262 6.87868 9.00002C6.87868 8.43741 7.10218 7.89784 7.5 7.50002L10.31 4.69002C11.2222 3.78016 12.4119 3.20057 13.6906 3.04299C14.9694 2.88541 16.2642 3.15885 17.37 3.82002L17.84 4.10002C18.2658 4.357 18.772 4.44613 19.26 4.35002L21 4.00002M21 3.00002L22 14H20M3 3.00002L2 14L8.5 20.5C8.89782 20.8978 9.43739 21.1213 10 21.1213C10.5626 21.1213 11.1022 20.8978 11.5 20.5C11.8978 20.1022 12.1213 19.5626 12.1213 19C12.1213 18.4374 11.8978 17.8978 11.5 17.5M3 4.00002H11"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.71406 14H5.00406C4.79439 14.0001 4.59005 14.0661 4.41994 14.1886C4.24982 14.3112 4.12253 14.4841 4.05606 14.683L2.05206 20.683C2.00182 20.8333 1.98803 20.9934 2.01182 21.1501C2.03561 21.3068 2.0963 21.4556 2.18888 21.5842C2.28147 21.7128 2.40331 21.8176 2.54434 21.8899C2.68538 21.9622 2.84158 21.9999 3.00006 22H21.0001C21.1584 21.9999 21.3145 21.9621 21.4554 21.8899C21.5964 21.8177 21.7181 21.713 21.8107 21.5845C21.9033 21.456 21.964 21.3074 21.9879 21.1508C22.0118 20.9942 21.9981 20.8343 21.9481 20.684L19.9481 14.684C19.8817 14.4848 19.7543 14.3115 19.584 14.1888C19.4137 14.066 19.209 13.9999 18.9991 14H15.2871M18.0001 8C18.0001 11.613 14.1311 15.429 12.6071 16.795C12.4327 16.9282 12.2194 17.0003 12.0001 17.0003C11.7807 17.0003 11.5674 16.9282 11.3931 16.795C9.87006 15.429 6.00006 11.613 6.00006 8C6.00006 6.4087 6.6322 4.88258 7.75742 3.75736C8.88264 2.63214 10.4088 2 12.0001 2C13.5914 2 15.1175 2.63214 16.2427 3.75736C17.3679 4.88258 18.0001 6.4087 18.0001 8ZM14.0001 8C14.0001 9.10457 13.1046 10 12.0001 10C10.8955 10 10.0001 9.10457 10.0001 8C10.0001 6.89543 10.8955 6 12.0001 6C13.1046 6 14.0001 6.89543 14.0001 8Z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.4 2.00015H6C5.46957 2.00015 4.96086 2.21086 4.58579 2.58594C4.21071 2.96101 4 3.46972 4 4.00015V20.0001C4 20.5306 4.21071 21.0393 4.58579 21.4144C4.96086 21.7894 5.46957 22.0001 6 22.0001H18C18.5304 22.0001 19.0391 21.7894 19.4142 21.4144C19.7893 21.0393 20 20.5306 20 20.0001V12.6001M2 6.00015H6M2 10.0001H6M2 14.0001H6M2 18.0001H6M21.378 5.62615C21.7764 5.22779 22.0001 4.68751 22.0001 4.12415C22.0001 3.56079 21.7764 3.0205 21.378 2.62215C20.9796 2.22379 20.4394 2 19.876 2C19.3126 2 18.7724 2.22379 18.374 2.62215L13.364 7.63415C13.1262 7.87177 12.9522 8.16548 12.858 8.48815L12.021 11.3581C11.9959 11.4442 11.9944 11.5354 12.0166 11.6222C12.0389 11.7091 12.0841 11.7883 12.1474 11.8517C12.2108 11.9151 12.2901 11.9603 12.3769 11.9825C12.4637 12.0048 12.555 12.0032 12.641 11.9781L15.511 11.1411C15.8337 11.0469 16.1274 10.8729 16.365 10.6351L21.378 5.62615Z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 21C1.99986 19.7062 2.31352 18.4316 2.91408 17.2857C3.51464 16.1397 4.38419 15.1565 5.44815 14.4203C6.51212 13.6842 7.73876 13.217 9.02288 13.059C10.307 12.901 11.6103 13.0568 12.821 13.513M21.378 16.626C21.7764 16.2276 22.0001 15.6874 22.0001 15.124C22.0001 14.5606 21.7764 14.0204 21.378 13.622C20.9796 13.2236 20.4394 12.9999 19.876 12.9999C19.3126 12.9999 18.7724 13.2236 18.374 13.622L14.364 17.634C14.1262 17.8716 13.9522 18.1653 13.858 18.488L13.021 21.358C12.9959 21.444 12.9944 21.5353 13.0166 21.6221C13.0389 21.7089 13.0841 21.7882 13.1474 21.8516C13.2108 21.9149 13.2901 21.9601 13.3769 21.9824C13.4637 22.0046 13.555 22.0031 13.641 21.978L16.511 21.141C16.8337 21.0468 17.1274 20.8728 17.365 20.635L21.378 16.626ZM15 8C15 10.7614 12.7614 13 10 13C7.23858 13 5 10.7614 5 8C5 5.23858 7.23858 3 10 3C12.7614 3 15 5.23858 15 8Z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Admin icons
const GridIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3H10V10H3V3ZM14 3H21V10H14V3ZM3 14H10V21H3V14ZM14 14H21V21H14V14Z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21M16 3.128C16.8578 3.35037 17.6174 3.85126 18.1597 4.55206C18.702 5.25286 18.9962 6.11389 18.9962 7C18.9962 7.88611 18.702 8.74714 18.1597 9.44794C17.6174 10.1487 16.8578 10.6496 16 10.872M22 21V19C21.9993 18.1137 21.7044 17.2528 21.1614 16.5523C20.6184 15.8519 19.8581 15.3516 19 15.13M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BuildingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 21H21M3 7L12 2L21 7M3 21V7M21 21V7M9 21V15H15V21M9 10H9.01M15 10H15.01M9 14H9.01M15 14H15.01"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Menu Data ────────────────────────────────────────────────────────────────

const sidebarMenus = {
  student: [
    { label: "Lowongan Magang",  href: "/internship", icon: <BriefcaseIcon /> },
    { label: "Lamaran Saya",     href: "/my-application",  icon: <ClipboardIcon /> },
    { label: "Tawaran Lowongan", href: "/offers",  icon: <HandshakeIcon /> },
    { label: "Career Mapping",   href: "/career",   icon: <MapPinIcon />    },
    { label: "Logbook",          href: "/logbook",  icon: <BookIcon />      },
    { label: "Profil",           href: "/profile",   icon: <UserIcon />      },
  ],
  hr: [
    { label: "Kelola Lowongan", href: "/hr/dashboard", icon: <BriefcaseIcon /> },
    { label: "Daftar Pelamar", href: "/hr/applicants", icon: <UsersIcon /> },
  ],
  company: [
    { label: "Dashboard",         href: "/company/dashboard", icon: <GridIcon />     },
    { label: "Lowongan Saya",     href: "/company/lowongan",  icon: <BriefcaseIcon /> },
    { label: "Pelamar",           href: "/company/pelamar",   icon: <UsersIcon />    },
    { label: "Profil Perusahaan", href: "/company/profil",    icon: <BuildingIcon /> },
  ],
  admin: [
    { label: "Dashboard",   href: "/admin/dashboard", icon: <GridIcon />     },
    { label: "Pengguna",    href: "/admin/users",      icon: <UsersIcon />    },
    { label: "Lowongan",    href: "/admin/lowongan",   icon: <BriefcaseIcon /> },
    { label: "Pengaturan",  href: "/admin/settings",   icon: <SettingsIcon /> },
  ],
};

// ─── Sidebar Component ────────────────────────────────────────────────────────

/**
 * Sidebar — role-aware, collapsible, normal document flow (NOT fixed/sticky)
 *
 * Props:
 *   role: "student" | "hr" | "company" | "admin"  (default: "student")
 */
export default function Sidebar({ role = "student" }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const items = sidebarMenus[role] ?? [];

  return (
    <aside
      style={{
        width: collapsed ? "64px" : "240px",
        flexShrink: 0,
        transition: "width 0.3s ease",
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #E5E7EB",
        display: "flex",
        flexDirection: "column",
        position: "relative",   // ✅ in normal flow — NOT fixed/sticky
        alignSelf: "stretch",   // ✅ grows with page content height
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Buka sidebar" : "Tutup sidebar"}
        style={{
          position: "absolute",
          right: "-12px",
          top: "24px",
          zIndex: 10,
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          style={{
            transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 0.3s ease",
          }}
        >
          <path d="M15 18L9 12L15 6" stroke="#4D44B5" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Nav items */}
      <nav style={{ display: "flex", flexDirection: "column", paddingTop: "20px" }}>
        {items.map((item) => {
          const isActive =
            location.pathname === item.href ||
            location.pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              to={item.href}
              title={collapsed ? item.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: collapsed ? "12px 0" : "12px 16px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderLeft: `4px solid ${isActive ? "#4D44B5" : "transparent"}`,
                backgroundColor: isActive ? "#E8F0FE" : "transparent",
                color: isActive ? "#4D44B5" : "#6B7280",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "500",
                whiteSpace: "nowrap",
                overflow: "hidden",
                transition: "background-color 0.2s, color 0.2s",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {/* Icon inherits color from parent via currentColor */}
              <span style={{ flexShrink: 0, display: "flex" }}>
                {item.icon}
              </span>

              {/* Label hidden when collapsed */}
              {!collapsed && (
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}