from pydantic import BaseModel


class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str

    dob: str
    gender: str

    nationality: str
    passport_number: str

    preferred_country: str
    preferred_intake: str

    password: str

class StudentResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    status: str

    class Config:
        from_attributes = True


class AssignOfficerRequest(BaseModel):
    officer_name: str