import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories import enrollment_repo, audit_repo, course_repo, student_repo
from app.schemas.enrollment import EnrollmentCreate, EnrollmentOut, EnrollmentUpdate

router = APIRouter(prefix="/api/enrollments", tags=["enrollments"])

CURRENT_USER = "admin@university.edu"


@router.get("/", response_model=List[EnrollmentOut])
def list_enrollments(
    student_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    if student_id:
        return enrollment_repo.get_enrollments_by_student(db, student_id)
    return enrollment_repo.get_all_enrollments(db)


@router.post("/", response_model=EnrollmentOut, status_code=201)
def create_enrollment(data: EnrollmentCreate, db: Session = Depends(get_db)):
    # Check for duplicate
    existing = enrollment_repo.get_enrollment_by_student_course_semester(
        db, data.student_id, data.course_id, data.semester, data.year
    )
    if existing:
        raise HTTPException(status_code=400, detail="Student already enrolled in this course for this semester")

    student = student_repo.get_student_by_id(db, data.student_id)
    course = course_repo.get_course_by_id(db, data.course_id)

    enrollment = enrollment_repo.create_enrollment(db, data)
    audit_repo.create_log(
        db,
        action_type="Enroll",
        entity="Enrollment",
        entity_id=student.student_number if student else data.student_id,
        performed_by=CURRENT_USER,
        old_value="",
        new_value=json.dumps({
            "course": course.course_code if course else data.course_id,
            "semester": data.semester,
            "year": data.year,
        }),
    )
    db.commit()
    db.refresh(enrollment)
    return enrollment


@router.put("/{enrollment_id}", response_model=EnrollmentOut)
def update_enrollment(enrollment_id: str, data: EnrollmentUpdate, db: Session = Depends(get_db)):
    enrollment = enrollment_repo.get_enrollment_by_id(db, enrollment_id)
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    updated = enrollment_repo.update_enrollment_status(db, enrollment, data.status)
    db.commit()
    db.refresh(updated)
    return updated


@router.delete("/{enrollment_id}")
def delete_enrollment(enrollment_id: str, db: Session = Depends(get_db)):
    enrollment = enrollment_repo.get_enrollment_by_id(db, enrollment_id)
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    student = student_repo.get_student_by_id(db, enrollment.student_id)
    course = course_repo.get_course_by_id(db, enrollment.course_id)
    audit_repo.create_log(
        db,
        action_type="Enroll",
        entity="Enrollment",
        entity_id=student.student_number if student else enrollment.student_id,
        performed_by=CURRENT_USER,
        old_value=json.dumps({"course": course.course_code if course else enrollment.course_id}),
        new_value=json.dumps({"status": "Removed"}),
    )
    enrollment_repo.delete_enrollment(db, enrollment)
    db.commit()
    return {"detail": "Enrollment removed"}
