import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.course import Course
from app.schemas.course import CourseCreate, CourseUpdate


def get_all_courses(db: Session) -> List[Course]:
    return db.query(Course).all()


def get_course_by_id(db: Session, course_id: str) -> Optional[Course]:
    return db.query(Course).filter(Course.id == course_id).first()


def get_course_by_code(db: Session, course_code: str) -> Optional[Course]:
    return db.query(Course).filter(Course.course_code == course_code).first()


def create_course(db: Session, data: CourseCreate) -> Course:
    course = Course(
        id=str(uuid.uuid4()),
        course_code=data.course_code,
        course_name=data.course_name,
        credits=data.credits,
    )
    db.add(course)
    db.flush()
    return course


def update_course(db: Session, course: Course, data: CourseUpdate) -> Course:
    update_data = data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(course, key, value)
    db.flush()
    return course


def delete_course(db: Session, course: Course):
    db.delete(course)
    db.flush()
