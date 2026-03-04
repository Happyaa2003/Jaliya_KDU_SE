from sqlalchemy import Column, String, Integer
from app.core.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(String, primary_key=True, index=True)
    course_code = Column(String, unique=True, index=True, nullable=False)
    course_name = Column(String, nullable=False)
    credits = Column(Integer, nullable=False)
