from enum import Enum


class StudentStatus(str, Enum):
    ENQUIRY = "ENQUIRY"
    COUNSELLING = "COUNSELLING"
    ADMISSION = "ADMISSION"
    ENROLLMENT = "ENROLLMENT"
    VISA = "VISA"
    COMPLETED = "COMPLETED"