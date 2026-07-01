# backend/app/models/superadmin_modules.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.sql import func
from app.database.database import Base

class Franchise(Base):
    __tablename__ = "franchises"

    id = Column(Integer, primary_key=True, index=True)
    franchise_code = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    owner_name = Column(String, nullable=False)
    owner_email = Column(String, nullable=False)
    owner_phone = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    registered_date = Column(DateTime(timezone=True), server_default=func.now())

class EducationInstitute(Base):
    __tablename__ = "education_institutes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    country = Column(String, nullable=False)
    city = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    target_type = Column(String, nullable=False)  # "ROLE", "EMAIL", or "ALL"
    target_value = Column(String, nullable=True)  # Store specific role title or email string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)  # Electricity, Rent, Salary, etc.
    amount = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    expense_date = Column(DateTime(timezone=True), nullable=False)
    receipt_path = Column(String, nullable=True)  # Path tracking like student photo_path
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    assigned_to = Column(String, nullable=False) # Email string
    priority = Column(String, default="MEDIUM")
    status = Column(String, default="PENDING")
    created_at = Column(DateTime(timezone=True), server_default=func.now())