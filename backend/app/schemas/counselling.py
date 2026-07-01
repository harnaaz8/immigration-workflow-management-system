from pydantic import BaseModel


class CounsellingCreate(BaseModel):
    student_id: int

    recommended_country: str

    recommended_university: str

    recommended_course: str

    intake: str

    notes: str