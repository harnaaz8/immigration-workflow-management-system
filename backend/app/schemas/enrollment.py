from pydantic import BaseModel


class EnrollmentCreate(BaseModel):
    student_id: int

    university_name: str

    course_name: str

    offer_letter_number: str

    tuition_fee: str

    notes: str