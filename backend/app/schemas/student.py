from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class StudentBase(BaseModel):
    first_name: str
    last_name: str
    address: str
    birthday: str
    degree_program: str


class StudentCreate(StudentBase):
    enrolled_courses: List[str] = []


class StudentUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    address: Optional[str] = None
    birthday: Optional[str] = None
    degree_program: Optional[str] = None
    status: Optional[str] = None


class StudentOut(StudentBase):
    id: str
    student_number: str
    status: str
    enrolled_courses: List[str] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
