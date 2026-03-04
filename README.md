# KDU Student Management System

<div align="center">
  <img src="Frontend/public/KDU-LOGO.png" alt="KDU Logo" width="120" />
  <br /><br />
  <strong>A full-stack web application for managing students, courses, and enrollments at KDU.</strong>
  <br /><br />

  ![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)
  ![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)
  ![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)
  ![Docker](https://img.shields.io/badge/Deploy-Docker-2496ED?logo=docker&logoColor=white)
</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Option A — Local Development (Recommended for Dev)](#-option-a--local-development)
- [Option B — Docker (One-Command Deploy)](#-option-b--docker-compose)
- [Default Credentials](#-default-credentials)
- [API Reference](#-api-reference)

---

## ✨ Features

| Module | Description |
|---|---|
| 🔐 **Auth** | JWT-based admin login with bcrypt password hashing |
| 👨‍🎓 **Students** | Register, view, edit, and deactivate students |
| 📚 **Courses** | Manage course catalog with credits |
| 📋 **Enrollment** | Enroll/drop students across semesters |
| 📊 **Dashboard** | Live stats — total students, courses, enrollments |
| 📁 **Audit Trail** | Full log of all admin actions |
| ⚙️ **Settings** | Create admin accounts, change passwords |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, TailwindCSS, shadcn/ui |
| Backend | Python 3.10+, FastAPI, SQLAlchemy 2, Pydantic v2 |
| Database | PostgreSQL 16+ |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Dev Server | Uvicorn (backend), Vite dev server (frontend) |
| Production | Docker + Docker Compose, Nginx |

---

## 📁 Project Structure

```
Jaliya_KDU_SE/
├── Frontend/               # React + Vite frontend
│   ├── public/
│   │   └── KDU-LOGO.png   # App logo & favicon
│   ├── src/
│   │   ├── pages/          # Route-level page components
│   │   ├── components/     # Shared UI components
│   │   └── services/api.ts # Axios API client
│   └── vite.config.ts      # Dev proxy → localhost:8000
│
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── api/routers/   # Route handlers
│   │   ├── core/          # DB, config, security
│   │   ├── models/        # SQLAlchemy models
│   │   ├── repositories/  # DB query functions
│   │   └── schemas/       # Pydantic schemas
│   ├── .env               # Environment variables (local)
│   └── requirements.txt   # Python dependencies
│
├── database/
│   ├── schema.sql          # Full schema + seed data (use for local setup)
│   ├── init.sql            # Used by Docker init
│   ├── seed.sql            # Used by Docker seed
│   └── fix_permissions.sql # Grant sms_user access
│
└── docker-compose.yml      # One-command full stack deploy
```

---

## ✅ Prerequisites

### For Local Development
- **Python 3.10+** — [python.org](https://www.python.org/downloads/)
- **Node.js 18+** — [nodejs.org](https://nodejs.org/)
- **PostgreSQL 16+** — [postgresql.org](https://www.postgresql.org/download/)
- **Git** — [git-scm.com](https://git-scm.com/)

### For Docker (Option B)
- **Docker Desktop** — [docker.com](https://www.docker.com/products/docker-desktop/)
- No Python or Node.js needed!

---

## 🖥 Option A — Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Jaliya_KDU_SE.git
cd Jaliya_KDU_SE
```

### 2. Set Up the Database

> Run these commands in **psql** as the `postgres` superuser.

**Windows (PowerShell):**
```powershell
$env:PGPASSWORD='YOUR_POSTGRES_PASSWORD'
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -f database/setup_local_db.sql
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d sms_db -f database/schema.sql
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d sms_db -f database/fix_permissions.sql
```

**macOS / Linux:**
```bash
sudo -u postgres psql -f database/setup_local_db.sql
sudo -u postgres psql -d sms_db -f database/schema.sql
sudo -u postgres psql -d sms_db -f database/fix_permissions.sql
```

This creates the `sms_user` role, `sms_db` database, all tables, seed data, and grants permissions.

---

### 3. Set Up the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Verify `.env` has the correct database URL:

```env
DATABASE_URL=postgresql://sms_user:sms_pass@localhost:5432/sms_db
SECRET_KEY=kdu-sms-secret-key-change-in-production-2025
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:5173,http://localhost:80,http://localhost
```

Start the backend:

```bash
# Make sure venv is activated first!
uvicorn app.main:app --reload --port 8000
```

✅ Backend running at: http://localhost:8000  
✅ API Docs at: http://localhost:8000/docs

---

### 4. Set Up the Frontend

Open a **new terminal**:

```bash
cd Frontend
npm install
npm run dev
```

✅ Frontend running at: http://localhost:8080

---

## 🐳 Option B — Docker Compose

> The easiest way to run the full stack on any machine. No manual setup needed.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Jaliya_KDU_SE.git
cd Jaliya_KDU_SE
```

### 2. Start Everything

```bash
docker compose up --build
```

Docker will automatically:
- Start PostgreSQL and create the database
- Build and start the FastAPI backend
- Build the React app and serve it via Nginx

| Service | URL |
|---|---|
| 🌐 Frontend | http://localhost |
| 🔧 Backend API | http://localhost:8000 |
| 📖 API Docs | http://localhost:8000/docs |

### 3. Stop Everything

```bash
docker compose down

# To also delete database data:
docker compose down -v
```

---

## 🔑 Default Credentials

| Field | Value |
|---|---|
| Email | `admin@university.edu` |
| Password | `admin123` |

> ⚠️ **Change the default password** after first login via **Settings → Change Password**.

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/login` | ❌ | Login, returns JWT |
| `GET` | `/auth/users` | ✅ | List all admins |
| `POST` | `/auth/users` | ✅ | Create admin |
| `PUT` | `/auth/users/{id}/password` | ✅ | Change password |
| `GET` | `/students/` | ✅ | List all students |
| `POST` | `/students/` | ✅ | Register student |
| `PUT` | `/students/{id}` | ✅ | Update student |
| `DELETE` | `/students/{id}` | ✅ | Delete student |
| `GET` | `/courses/` | ✅ | List courses |
| `POST` | `/courses/` | ✅ | Create course |
| `GET` | `/enrollments/` | ✅ | List enrollments |
| `POST` | `/enrollments/` | ✅ | Enroll student |
| `GET` | `/dashboard/stats` | ✅ | Dashboard statistics |
| `GET` | `/audit-logs/` | ✅ | Audit trail |

> Full interactive docs: http://localhost:8000/docs

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (cost factor 12)
- JWT tokens expire after **60 minutes**
- All admin routes require a valid JWT
- Change `SECRET_KEY` in `.env` before deploying to production

---

## 📄 License

This project is developed for **KDU (Kotelawala Defence University)** academic purposes.
