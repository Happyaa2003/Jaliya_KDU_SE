from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.api.routers import auth, students, courses, enrollments, audit, dashboard

# Import all models to ensure they register with Base
import app.models  # noqa

app = FastAPI(
    title="Student Management System API",
    description="Backend API for the KDU Student Management System",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(courses.router)
app.include_router(enrollments.router)
app.include_router(audit.router)
app.include_router(dashboard.router)


@app.on_event("startup")
def startup_event():
    """Create tables and seed default admin user on startup."""
    Base.metadata.create_all(bind=engine)
    _seed_admin()


def _seed_admin():
    """Create a default admin user if none exists."""
    from app.repositories import user_repo
    db = SessionLocal()
    try:
        existing = user_repo.get_user_by_email(db, "admin@university.edu")
        if not existing:
            user_repo.create_user(db, "admin@university.edu", "admin123", "Administrator")
            db.commit()
    finally:
        db.close()


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
