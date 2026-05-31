# IPB Internship

Sistem informasi magang berbasis web untuk mahasiswa IPB University.

## Contributors

**Kelompok 5 Paralel P3 - Analisis dan Desain Sistem**  
Institut Pertanian Bogor (IPB University)

| Name | NIM |
|------|-----|
| Gilang Agung Prakoso | G6401231039 |
| Fauzan Arif Tricahya | G6401231040 |
| Wandy Chandra Wijaya | G6401231054 |
| Muhammad Abdullah | G6401231104 |

---

## Tentang

IPB Internship adalah sistem informasi berbasis web yang menghubungkan mahasiswa IPB dengan perusahaan mitra untuk program magang. Sistem ini memiliki tiga peran pengguna:

- **Student** — Mencari lowongan magang, melamar, menerima/menolak penawaran, dan melihat peta karir alumni
- **HR** — Membuat lowongan magang, mengelola lamaran, mengubah status lamaran, dan membuat penawaran
- **Admin** — Memverifikasi registrasi HR dan perusahaan (approve/reject)

---

## Fitur

### Autentikasi & Otorisasi
- Registrasi Student (validasi email `@apps.ipb.ac.id`) dan HR (upload NPWP)
- Verifikasi email melalui Brevo
- Login dengan JWT & role-based access control (Student, HR, Admin)

### Student
- Cari & filter lowongan magang aktif
- Lihat detail lowongan beserta informasi perusahaan
- Lamar ke lowongan magang (dengan CV)
- Lihat status lamaran & riwayat perubahan status
- Terima/tolak penawaran (offer)
- Peta karir alumni per jurusan per perusahaan
- Kelola profil, upload CV & foto profil
- Kelola skill

### HR
- Dashboard lowongan magang
- Buat, edit, tutup, dan buka ulang lowongan magang
- Kelola profil perusahaan & upload foto perusahaan
- Lihat daftar pelamar per lowongan
- Update status lamaran (Pending → Review → Interview → Accepted/Rejected)
- Buat penawaran (offer) untuk pelamar yang diterima

### Admin
- Lihat daftar HR yang menunggu verifikasi
- Lihat detail HR & dokumen NPWP perusahaan
- Approve/reject registrasi HR
- Lihat riwayat keputusan (verified/rejected)

### Integrasi Eksternal
- **Brevo** — Email verifikasi & notifikasi (approval, rejection, penawaran)
- **Cloudinary** — Upload & penyimpanan dokumen (CV, NPWP, foto profil, offering letter)

---

## Teknologi

### Backend
| Teknologi | Purpose |
|-----------|---------|
| **FastAPI** | REST API framework |
| **PostgreSQL + asyncpg** | Database (async) |
| **SQLAlchemy 2.0** | Async ORM |
| **Alembic** | Database migration |
| **Pydantic** | Data validation & serialization |
| **Brevo API** | Transactional email |
| **Cloudinary API** | Cloud file storage |
| **JWT + Bcrypt** | Authentication & security |

### Frontend
| Teknologi | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool & dev server |
| **React Router 6** | Client-side routing |
| **Axios** | HTTP client |
| **TanStack Query** | Server state management |

---

## Struktur Proyek

```
ipb-internship-and-career-tracker/
├── backend/
│   ├── alembic/                    # Database migrations
│   ├── app/
│   │   ├── application/
│   │   │   └── services/           # Business logic (use cases)
│   │   ├── core/                   # Config & security
│   │   ├── db/                     # Database seeder
│   │   ├── domain/
│   │   │   ├── entities/           # Pydantic entities & enums
│   │   │   └── repositories/      # Repository interfaces
│   │   ├── infrastructure/
│   │   │   ├── models/             # SQLAlchemy ORM models
│   │   │   └── repositories/      # Repository implementations
│   │   ├── presentation/
│   │   │   ├── api/                # FastAPI routers
│   │   │   └── schemas/            # Request/response schemas
│   │   └── main.py
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/                    # Axios instance
│   │   ├── components/             # UI components (atoms, molecules, organisms)
│   │   ├── constants/              # Data constants
│   │   ├── context/                # React Context (AuthContext)
│   │   ├── hooks/                  # Custom hooks (TanStack Query)
│   │   ├── layouts/                # Layout components
│   │   ├── pages/
│   │   │   ├── auth/               # Login, Register, VerifyEmail
│   │   │   ├── student/            # Student pages
│   │   │   ├── hr/                 # HR pages
│   │   │   └── admin/              # Admin pages
│   │   ├── services/               # API service functions
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL 14+

### 1. Clone Repository
```bash
git clone https://github.com/fauzan-arift/ipb-internship-and-career-tracker.git
cd ipb-internship-and-career-tracker
```

### 2. Setup Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env dengan database credentials, SECRET_KEY, BREVO_API_KEY, ADMIN_PASSWORD

alembic upgrade head
python -m app.db.seed
uvicorn app.main:app --reload
```

Backend: **http://localhost:8000**  
API Docs: **http://localhost:8000/docs**

### 2a. Setup Backend (Docker)
```bash
cd backend
cp .env.example .env
# Edit .env (DATABASE_URL: postgresql://ipb:ipb@db:5432/ipb_internship_tracker)

docker compose up --build
docker compose exec backend alembic upgrade head
docker compose exec backend python -m app.db.seed
```

### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend: **http://localhost:3000**

---

## Architecture

Backend menggunakan **Clean Architecture**:

```
┌───────────────────────────────────────────────┐
│              Presentation Layer               │  FastAPI Routers & Schemas
├───────────────────────────────────────────────┤
│              Application Layer                │  Services (business logic)
├───────────────────────────────────────────────┤
│                 Domain Layer                  │  Pydantic Entities & Interfaces
├───────────────────────────────────────────────┤
│             Infrastructure Layer              │  SQLAlchemy ORM, Brevo, Cloudinary
└───────────────────────────────────────────────┘
```

**Patterns yang digunakan:**
- **Unit of Work** — Kontrol transaksi database secara atomik
- **Repository Pattern** — Abstraksi akses database melalui interfaces
- **Dependency Injection** — Loosely coupled components
- **Domain Entity** — Business logic & validasi di Pydantic model (terpisah dari ORM)

---

## License

MIT License — see [LICENSE](LICENSE) for details.

Copyright (c) 2026 Kelompok 5 Paralel P3 - Analisis dan Desain Sistem
