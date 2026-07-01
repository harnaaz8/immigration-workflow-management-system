from pydantic import BaseModel


class AdmissionCreate(BaseModel):
    student_id: int

    university_name: str

    course_name: str

    intake: str

    application_id: str

    notes: str