import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.enrollment import Enrollment
from app.schemas.enrollment import EnrollmentCreate


def get_all_enrollments(db: Session) -> List[Enrollment]:
    return db.query(Enrollment).all()


def get_enrollments_by_student(db: Session, student_id: str) -> List[Enrollment]:
    return db.query(Enrollment).filter(Enrollment.student_id == student_id).all()


def get_enrollment_by_id(db: Session, enrollment_id: str) -> Optional[Enrollment]:
    return db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()


def get_enrollment_by_student_course_semester(
    db: Session, student_id: str, course_id: str, semester: str, year: int
) -> Optional[Enrollment]:
    return db.query(Enrollment).filter(
        Enrollment.student_id == student_id,
        Enrollment.course_id == course_id,
        Enrollment.semester == semester,
        Enrollment.year == year,
    ).first()


def create_enrollment(db: Session, data: EnrollmentCreate) -> Enrollment:
    enrollment = Enrollment(
        id=str(uuid.uuid4()),
        student_id=data.student_id,
        course_id=data.course_id,
        semester=data.semester,
        year=data.year,
        status="Enrolled",
    )
    db.add(enrollment)
    db.flush()
    return enrollment


def delete_enrollment(db: Session, enrollment: Enrollment):
    db.delete(enrollment)
    db.flush()


def update_enrollment_status(db: Session, enrollment: Enrollment, status: str) -> Enrollment:
    enrollment.status = status
    db.flush()
    return enrollment
