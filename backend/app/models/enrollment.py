from sqlalchemy import Column, String, Integer, ForeignKey
from app.core.database import Base


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(String, primary_key=True, index=True)
    student_id = Column(String, ForeignKey("students.id"), nullable=False, index=True)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False, index=True)
    semester = Column(String, nullable=False)
    year = Column(Integer, nullable=False)
    status = Column(String, default="Enrolled", nullable=False)
