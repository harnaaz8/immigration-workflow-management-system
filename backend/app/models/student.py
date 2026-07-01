from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.enums.student_status import StudentStatus
from app.database.database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_code = Column(String, unique=True, nullable=False)
    
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    full_name = Column(String)
    
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=False)
    dob = Column(String)
    gender = Column(String)
    nationality = Column(String)
    passport_number = Column(String)
    
    preferred_country = Column(String)
    preferred_intake = Column(String)
    
    # ✅ Added: Storage location path tracking for student avatar profile uploads
    photo_path = Column(String, nullable=True)

    # Workflow Status tracking
    status = Column(
        String,
        default=StudentStatus.ENQUIRY.value
    )

    # Assigned Workflow Officers
    assigned_enquiry_officer = Column(String)
    assigned_counsellor = Column(String)
    assigned_admission_officer = Column(String)
    assigned_enrollment_officer = Column(String)
    assigned_visa_officer = Column(String)

    # Status Logs & Operational Metadata Notes
    counselling_fee_status = Column(String, default="PENDING")
    admission_fee_status = Column(String, default="PENDING")
    counselling_notes = Column(String)
    admission_notes = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )