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
- **Multi-role Authentication**: Admin, Student, Company
- **JWT-based Security**: Token authentication dengan bcrypt
- **Role-based Access Control**: Setiap role punya akses berbeda
- **Clean Architecture**: Domain-driven design dengan separation of concerns


## Teknologi

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | 0.109.0 | REST API framework |
| **PostgreSQL** | 14+ | Database |
| **SQLAlchemy** | 2.0.25 | ORM |
| **Pydantic** | 2.5.3 | Data validation |
| **JWT** | - | Authentication |
| **Bcrypt** | - | Password hashing |

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
│   ├── app/
│   │   ├── api/            # API endpoints & routes
│   │   ├── core/           # Config & security
│   │   ├── db/             # Database connection
│   │   ├── domain/         # Domain models (business logic)
│   │   ├── models/         # ORM models (database)
│   │   ├── repositories/   # Repository layer (data access)
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Service layer
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

Project ini menggunakan **Clean Architecture** dengan **Domain-Driven Design**:

### Layer Architecture
```
┌─────────────────────────────────┐
│     API Layer (FastAPI)         │  ← Endpoints
├─────────────────────────────────┤
│     Service Layer               │  ← Business orchestration
├─────────────────────────────────┤
│     Domain Layer                │  ← Business logic & validation
├─────────────────────────────────┤
│     ORM Layer (SQLAlchemy)      │  ← Database mapping
├─────────────────────────────────┤
│     Database (PostgreSQL)       │  ← Persistence
└─────────────────────────────────┘
```

### Key Patterns
- **Domain Model**: Pure Python untuk business logic
- **ORM Model**: SQLAlchemy untuk database
- **Service Layer**: Orchestration & use cases
- **Mapper Pattern**: Convert Domain ↔ ORM
- **User + Profile Pattern**: Separation of auth and role-specific data

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

