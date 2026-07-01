from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class Admission(Base):
    __tablename__ = "admissions"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False
    )

    university_name = Column(String)

    course_name = Column(String)

    intake = Column(String)

    application_status = Column(
        String,
        default="SUBMITTED"
    )

    application_id = Column(String)

    notes = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )