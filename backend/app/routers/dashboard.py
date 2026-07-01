from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database.dependencies import get_db
from app.models.student import Student
from app.models.enquiry import Enquiry
from app.models.counselling import Counselling
from app.models.admission import Admission
from app.models.enrollment import Enrollment
from app.models.visa import Visa
from app.models.user import User
from app.core.auth import get_current_super_admin

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_super_admin)
):
    # Status breakdown
    statuses = ["ENQUIRY", "COUNSELLING", "ADMISSION", "ENROLLMENT", "VISA", "REJECTED"]
    status_breakdown = []
    for s in statuses:
        count = db.query(Student).filter(Student.status == s).count()
        status_breakdown.append({"status": s, "count": count})

    # Students registered per month (last 6 months)
    monthly_data = []
    for i in range(5, -1, -1):
        date = datetime.utcnow() - timedelta(days=30 * i)
        month_label = date.strftime("%b")
        count = db.query(Student).filter(
            func.extract("month", Student.created_at) == date.month,
            func.extract("year", Student.created_at) == date.year
        ).count()
        monthly_data.append({"month": month_label, "students": count})

    return {
        "students": db.query(Student).count(),
        "enquiries": db.query(Enquiry).count(),
        "counselling": db.query(Counselling).count(),
        "admissions": db.query(Admission).count(),
        "enrollments": db.query(Enrollment).count(),
        "visas": db.query(Visa).count(),
        "staff": db.query(User).count(),
        "status_breakdown": status_breakdown,
        "monthly_data": monthly_data
    }