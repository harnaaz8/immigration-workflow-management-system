from pydantic import BaseModel
from app.enums.user_role import UserRole


class CreateUserRequest(BaseModel):
    name: str
    email: str
    password: str
    role: UserRole


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str

    class Config:
        from_attributes = True