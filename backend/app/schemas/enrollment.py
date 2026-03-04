from typing import Optional
from pydantic import BaseModel


class EnrollmentBase(BaseModel):
    student_id: str
    course_id: str
    semester: str
    year: int


class EnrollmentCreate(EnrollmentBase):
    pass


class EnrollmentUpdate(BaseModel):
    status: Optional[str] = None


class EnrollmentOut(EnrollmentBase):
    id: str
    status: str

    class Config:
        from_attributes = True
