export const sidebarMenus = {
  student: [
    { label: "Lowongan Magang", href: "/lowongan", icon: "briefcase" },
    { label: "Lamaran Saya",    href: "/lamaran",  icon: "clipboard" },
    { label: "Tawaran Lowongan",href: "/tawaran",  icon: "handshake" },
    { label: "Career Mapping",  href: "/career",   icon: "map-pin"   },
    { label: "Logbook",         href: "/logbook",  icon: "book"      },
    { label: "Profil",          href: "/profil",   icon: "user"      },
  ],
  company: [
    { label: "Dashboard",       href: "/company/dashboard", icon: "grid"      },
    { label: "Lowongan Saya",   href: "/company/lowongan",  icon: "briefcase" },
    { label: "Pelamar",         href: "/company/pelamar",   icon: "users"     },
    { label: "Profil Perusahaan",href: "/company/profil",   icon: "building"  },
  ],
  admin: [
    { label: "Dashboard",       href: "/admin/dashboard",   icon: "grid"      },
    { label: "Pengguna",        href: "/admin/users",       icon: "users"     },
    { label: "Lowongan",        href: "/admin/lowongan",    icon: "briefcase" },
    { label: "Pengaturan",      href: "/admin/settings",    icon: "settings"  },
  ],
};