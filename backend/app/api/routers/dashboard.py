from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.student import Student
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.audit_log import AuditLog

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_students = db.query(Student).count()
    active_students = db.query(Student).filter(Student.status == "Active").count()
    total_courses = db.query(Course).count()
    active_enrollments = db.query(Enrollment).filter(Enrollment.status == "Enrolled").count()
    total_logs = db.query(AuditLog).count()
    return {
        "total_students": total_students,
        "active_students": active_students,
        "total_courses": total_courses,
        "active_enrollments": active_enrollments,
        "total_logs": total_logs,
    }
