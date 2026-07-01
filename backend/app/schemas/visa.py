from pydantic import BaseModel


class VisaCreate(BaseModel):
    student_id: int

    visa_type: str

    application_number: str

    biometric_date: str

    interview_date: str

    decision_date: str

    notes: str