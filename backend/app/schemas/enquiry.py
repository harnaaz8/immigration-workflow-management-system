from pydantic import BaseModel


class EnquiryCreate(BaseModel):
    student_id: int

    academic_background: str

    english_test_type: str
    english_score: str

    work_experience: str

    funding_source: str

    notes: str