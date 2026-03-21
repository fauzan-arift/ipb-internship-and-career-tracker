# IPB Internship & Career Tracker

Sistem tracking magang dan karier untuk mahasiswa IPB.

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

IPB Internship & Career Tracker adalah sistem informasi berbasis web yang dirancang untuk:

- **Mahasiswa**: Melacak status lamaran magang, mencatat aktivitas MBKM, dan mengelola deadline laporan
- **HR**: Memposting lowongan magang dan mengelola pelamar
- **Admin**: Mengawasi seluruh proses dan manajemen pengguna

### Permasalahan yang Diselesaikan
- Mahasiswa kesulitan melacak status lamaran magang
- Tidak ada sistem terpusat untuk program MBKM
- Sering terlewat deadline pelaporan dan konversi SKS
- **Solusi**: Sistem tracking terpusat

---

## Fitur Utama

### Saat Ini 
- **Clean Architecture & DDD**: Strict separation of concerns (Domain, Application, Infrastructure, Presentation)
- **Multi-role Authentication**: Admin, Student, HR
- **Async Database Operations**: Performa tinggi dengan *asyncpg*
- **External Integrations**: Brevo (Email Verification & Notifications) & Cloudinary (Cloud Document Storage)
- **Role-based Access Control & JWT Security**: Akses berdasarkan spesifik role pengguna

## Teknologi

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | 0.109.0 | REST API framework |
| **PostgreSQL & asyncpg** | 14+ | Async Database Driver |
| **SQLAlchemy** | 2.0.25 | Async ORM |
| **Pydantic** | 2.5.3 | Data validation |
| **Brevo API** | - | Transactional Emails |
| **Cloudinary API**| - | Cloud File Storage |
| **JWT & Bcrypt** | - | Authentication & Security |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI framework |
| **Vite** | 5.0.8 | Build tool |
| **React Router** | 6.21.1 | Routing |
| **Axios** | 1.6.5 | HTTP client |
| **TanStack Query** | 5.17.9 | Data fetching |

---

## Struktur Proyek

```
ipb-internship-and-career-tracker/
├── backend/                 # FastAPI Backend
│   ├── alembic/            # Database Migrations (Async)
│   ├── app/
│   │   ├── application/    # Business services (Use Cases)
│   │   ├── core/           # Config & security
│   │   ├── db/             # Database Seeder
│   │   ├── domain/         # Entities, Enums, Interfaces, UoW
│   │   ├── infrastructure/ # DB connections, SQLAlchemy ORMs, Cloudinary, Brevo
│   │   ├── presentation/   # FastAPI Routes, Schemas, Dependencies
│   │   └── main.py         # App entry point
│   ├── .env.example
│   ├── requirements.txt
│   └── README.md           # Backend documentation
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React Context (state)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API calls
│   │   └── App.jsx
│   ├── package.json
│   └── README.md           # Frontend documentation
└── README.md
```

---

## Quick Start

### Prerequisites
- **Python** 3.9+
- **Node.js** 16+
- **PostgreSQL** 14+
- **Git**

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
# Edit .env dengan database credentials

# Buat database PostgreSQL
createdb ipb_internship_tracker

# Run migration (create tables)
alembic upgrade head

# Seed default admin account
python -m app.db.seed

# Run server
uvicorn app.main:app --reload
```
Backend running di: **http://localhost:8000**  
API Docs: **http://localhost:8000/docs**

### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env

npm run dev
```
Frontend running di: **http://localhost:3000**

---

## Architecture

Project ini menggunakan **Clean Architecture** dengan **Domain-Driven Design (DDD)**:

Aturan Utama: Dependency/Ketergantungan **HANYA BISA** mengarah ke dalam (menuju Core Domain Layer).

### Layer Architecture
```
┌───────────────────────────────────────────────┐
│              Presentation Layer               │  ← FastAPI Routes, Pydantic Schemas, Dependencies
├───────────────────────────────────────────────┤
│              Application Layer                │  ← Use case flow orchestration (Services)
├───────────────────────────────────────────────┤
│                 Domain Layer                  │  ← Pure Python Entities & Interfaces
├───────────────────────────────────────────────┤
│             Infrastructure Layer              │  ← SQLAlchemy ORMs, Brevo, Cloudinary
└───────────────────────────────────────────────┘
```

### Key Patterns
- **Rich Domain Model**: *Business logic* & validasi berada di dalam *Entity* murni Pydantic (tidak ada SQLAlchemy).
- **Unit of Work (UoW)**: Mengontrol integritas dan *rollback transactions* secara *asynchronous* dari service hingga model.
- **Repository Pattern**: Abstraksi akses database menggunakan *Interfaces* (memisahkan query DB dari logika).
- **Dependency Injection**: *Loosely coupled components* (mudah untuk keperluan testing).
- **External Client Isolation**: Alat 3rd party seperti *Brevo* dan *Cloudinary* tidak masuk ke layer aplikasi, melainkan masuk ke *Infrastructure* yang digunakan lewat abstraksi.
### Referensi Arsitektur
- Pembangunan *Clean Architecture* Backend ini disusun mengacu pada: [How to Implement Clean Architecture in FastAPI: A Step-by-Step Guide](https://medium.com/@bhagyasithumini/how-to-implement-clean-architecture-in-fastapi-a-step-by-step-guide-8b73a75c650b)

---

## Development

### Backend Development
```bash
cd backend

# Activate virtual environment
venv\Scripts\activate

# Run with auto-reload
uvicorn app.main:app --reload --port 8000

# Seed admin account
python -m app.db.seed

# Run tests
pytest

# Check code quality
pylint app/
```

### Frontend Development
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```
---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright (c) 2026 Kelompok 5 Paralel P3 - Analisis dan Desain Sistem

---

