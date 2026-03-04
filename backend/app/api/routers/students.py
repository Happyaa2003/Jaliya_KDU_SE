import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories import student_repo, audit_repo, enrollment_repo
from app.schemas.student import StudentCreate, StudentUpdate, StudentOut

router = APIRouter(prefix="/api/students", tags=["students"])

CURRENT_USER = "admin@university.edu"


def build_student_out(student, db: Session) -> dict:
    enrolled_courses = enrollment_repo.get_enrollments_by_student(db, student.id)
    from app.models.course import Course
    course_codes = []
    for e in enrolled_courses:
        c = db.query(Course).filter(Course.id == e.course_id).first()
        if c:
            course_codes.append(c.course_code)
    return {
        "id": student.id,
        "student_number": student.student_number,
        "first_name": student.first_name,
        "last_name": student.last_name,
        "address": student.address,
        "birthday": student.birthday,
        "degree_program": student.degree_program,
        "status": student.status,
        "enrolled_courses": course_codes,
        "created_at": student.created_at,
        "updated_at": student.updated_at,
    }


@router.get("/", response_model=List[StudentOut])
def list_students(db: Session = Depends(get_db)):
    students = student_repo.get_all_students(db)
    return [build_student_out(s, db) for s in students]


@router.get("/{student_id}", response_model=StudentOut)
def get_student(student_id: str, db: Session = Depends(get_db)):
    student = student_repo.get_student_by_id(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return build_student_out(student, db)


@router.post("/", response_model=StudentOut, status_code=201)
def create_student(data: StudentCreate, db: Session = Depends(get_db)):
    student = student_repo.create_student(db, data)
    audit_repo.create_log(
        db,
        action_type="Create",
        entity="Student",
        entity_id=student.student_number,
        performed_by=CURRENT_USER,
        old_value="",
        new_value=json.dumps({"firstName": student.first_name, "lastName": student.last_name, "degreeProgram": student.degree_program}),
    )
    # Handle initial course enrollments
    if data.enrolled_courses:
        from app.models.course import Course
        from app.schemas.enrollment import EnrollmentCreate
        from app.repositories import enrollment_repo as er
        for code in data.enrolled_courses:
            course = db.query(Course).filter(Course.course_code == code).first()
            if course:
                er.create_enrollment(db, EnrollmentCreate(
                    student_id=student.id,
                    course_id=course.id,
                    semester="1st Semester",
                    year=2025,
                ))
    db.commit()
    db.refresh(student)
    return build_student_out(student, db)


@router.put("/{student_id}", response_model=StudentOut)
def update_student(student_id: str, data: StudentUpdate, db: Session = Depends(get_db)):
    student = student_repo.get_student_by_id(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    old = json.dumps({"firstName": student.first_name, "lastName": student.last_name})
    updated = student_repo.update_student(db, student, data)
    audit_repo.create_log(
        db,
        action_type="Update",
        entity="Student",
        entity_id=student.student_number,
        performed_by=CURRENT_USER,
        old_value=old,
        new_value=json.dumps({"firstName": updated.first_name, "lastName": updated.last_name}),
    )
    db.commit()
    db.refresh(updated)
    return build_student_out(updated, db)


@router.delete("/{student_id}", response_model=StudentOut)
def delete_student(student_id: str, db: Session = Depends(get_db)):
    student = student_repo.get_student_by_id(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    old = json.dumps({"status": student.status})
    updated = student_repo.delete_student(db, student)
    audit_repo.create_log(
        db,
        action_type="Delete",
        entity="Student",
        entity_id=student.student_number,
        performed_by=CURRENT_USER,
        old_value=old,
        new_value=json.dumps({"status": "Inactive"}),
    )
    db.commit()
    db.refresh(updated)
    return build_student_out(updated, db)
