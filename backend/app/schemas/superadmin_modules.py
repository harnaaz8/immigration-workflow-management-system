# backend/app/schemas/superadmin_modules.py
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class FranchiseCreate(BaseModel):
    franchise_code: str
    name: str
    owner_name: str
    owner_email: EmailStr
    owner_phone: str

class InstituteCreate(BaseModel):
    name: str
    country: str
    city: str

class NotificationCreate(BaseModel):
    title: str
    message: str
    target_type: str  # "ALL", "ROLE", "EMAIL"
    target_value: Optional[str] = None

class ExpenseCreate(BaseModel):
    category: str
    amount: float
    description: Optional[str] = None
    expense_date: datetime

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: str
    priority: Optional[str] = "MEDIUM"