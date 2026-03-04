from typing import Optional
from pydantic import BaseModel


class CourseBase(BaseModel):
    course_code: str
    course_name: str
    credits: int


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    course_code: Optional[str] = None
    course_name: Optional[str] = None
    credits: Optional[int] = None


class CourseOut(CourseBase):
    id: str

    class Config:
        from_attributes = True
