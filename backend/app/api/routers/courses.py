import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.repositories import course_repo, audit_repo
from app.schemas.course import CourseCreate, CourseUpdate, CourseOut

router = APIRouter(prefix="/api/courses", tags=["courses"])

CURRENT_USER = "admin@university.edu"


@router.get("/", response_model=List[CourseOut])
def list_courses(db: Session = Depends(get_db)):
    return course_repo.get_all_courses(db)


@router.get("/{course_id}", response_model=CourseOut)
def get_course(course_id: str, db: Session = Depends(get_db)):
    course = course_repo.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.post("/", response_model=CourseOut, status_code=201)
def create_course(data: CourseCreate, db: Session = Depends(get_db)):
    existing = course_repo.get_course_by_code(db, data.course_code)
    if existing:
        raise HTTPException(status_code=400, detail="Course code already exists")
    course = course_repo.create_course(db, data)
    audit_repo.create_log(
        db,
        action_type="Create",
        entity="Course",
        entity_id=course.course_code,
        performed_by=CURRENT_USER,
        old_value="",
        new_value=json.dumps({"courseCode": course.course_code, "courseName": course.course_name, "credits": course.credits}),
    )
    db.commit()
    db.refresh(course)
    return course


@router.put("/{course_id}", response_model=CourseOut)
def update_course(course_id: str, data: CourseUpdate, db: Session = Depends(get_db)):
    course = course_repo.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    old = json.dumps({"credits": course.credits})
    updated = course_repo.update_course(db, course, data)
    audit_repo.create_log(
        db,
        action_type="Update",
        entity="Course",
        entity_id=course.course_code,
        performed_by=CURRENT_USER,
        old_value=old,
        new_value=json.dumps({"credits": updated.credits}),
    )
    db.commit()
    db.refresh(updated)
    return updated


@router.delete("/{course_id}")
def delete_course(course_id: str, db: Session = Depends(get_db)):
    course = course_repo.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    old = json.dumps({"courseCode": course.course_code, "courseName": course.course_name})
    audit_repo.create_log(
        db,
        action_type="Delete",
        entity="Course",
        entity_id=course.course_code,
        performed_by=CURRENT_USER,
        old_value=old,
        new_value="",
    )
    course_repo.delete_course(db, course)
    db.commit()
    return {"detail": "Course deleted"}
