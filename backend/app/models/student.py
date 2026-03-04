from sqlalchemy import Column, String, Date, DateTime, Enum, func
from app.core.database import Base
import enum


class StudentStatus(str, enum.Enum):
    Active = "Active"
    Inactive = "Inactive"


class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, index=True)
    student_number = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    birthday = Column(String, nullable=False)
    degree_program = Column(String, nullable=False)
    status = Column(String, default="Active", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
