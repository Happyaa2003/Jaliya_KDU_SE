import uuid
import json
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.student import Student
from app.models.enrollment import Enrollment
from app.schemas.student import StudentCreate, StudentUpdate


def generate_student_number(db: Session) -> str:
    count = db.query(Student).count() + 1
    return f"SMS-2025-{count:04d}"


def get_all_students(db: Session) -> List[Student]:
    return db.query(Student).all()


def get_student_by_id(db: Session, student_id: str) -> Optional[Student]:
    return db.query(Student).filter(Student.id == student_id).first()


def create_student(db: Session, data: StudentCreate) -> Student:
    student_id = str(uuid.uuid4())
    student_number = generate_student_number(db)
    student = Student(
        id=student_id,
        student_number=student_number,
        first_name=data.first_name,
        last_name=data.last_name,
        address=data.address,
        birthday=data.birthday,
        degree_program=data.degree_program,
        status="Active",
    )
    db.add(student)
    db.flush()
    return student


def update_student(db: Session, student: Student, data: StudentUpdate) -> Student:
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(student, key, value)
    db.flush()
    return student


def delete_student(db: Session, student: Student) -> Student:
    student.status = "Inactive"
    db.flush()
    return student


def get_enrolled_course_codes(db: Session, student_id: str) -> List[str]:
    from app.models.course import Course
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == student_id).all()
    course_ids = [e.course_id for e in enrollments]
    courses = db.query(Course).filter(Course.id.in_(course_ids)).all()
    return [c.course_code for c in courses]
