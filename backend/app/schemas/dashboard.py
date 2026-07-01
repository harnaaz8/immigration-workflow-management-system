from pydantic import BaseModel


class DashboardResponse(BaseModel):
    students: int
    enquiries: int
    counselling: int
    admissions: int
    enrollments: int
    visas: int
    staff: int