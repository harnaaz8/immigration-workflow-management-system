from sqlalchemy import Column, Integer, String, Text
from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class Visa(Base):
    __tablename__ = "visas"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False
    )

    visa_type = Column(String)

    visa_status = Column(
        String,
        default="APPLIED"
    )

    application_number = Column(String)

    biometric_date = Column(String)

    interview_date = Column(String)

    decision_date = Column(String)

    notes = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )