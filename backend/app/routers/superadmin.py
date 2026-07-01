from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.core.auth import get_current_super_admin, get_current_user
from app.models.user import User
from app.models.superadmin_modules import Notification, Task, Franchise, EducationInstitute, Expense
from app.schemas.superadmin_modules import (
    NotificationCreate,
    TaskCreate,
    FranchiseCreate,
    InstituteCreate,
    ExpenseCreate,
)

router = APIRouter(prefix="/superadmin", tags=["Superadmin Modules"])


# --- FRANCHISE ROUTES ---
@router.get("/franchises")
def get_franchises(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    return db.query(Franchise).all()


@router.post("/franchises")
def create_franchise(
    data: FranchiseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    existing = db.query(Franchise).filter(Franchise.franchise_code == data.franchise_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Franchise code already exists")

    franchise = Franchise(**data.dict())
    db.add(franchise)
    db.commit()
    db.refresh(franchise)
    return franchise


@router.patch("/franchises/{franchise_id}/toggle")
def toggle_franchise(
    franchise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    franchise = db.query(Franchise).filter(Franchise.id == franchise_id).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Franchise not found")

    franchise.is_active = not franchise.is_active
    db.commit()
    db.refresh(franchise)
    return franchise


@router.delete("/franchises/{franchise_id}")
def delete_franchise(
    franchise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    franchise = db.query(Franchise).filter(Franchise.id == franchise_id).first()
    if not franchise:
        raise HTTPException(status_code=404, detail="Franchise not found")

    db.delete(franchise)
    db.commit()
    return {"message": "Franchise deleted"}


# --- INSTITUTE ROUTES ---
@router.get("/institutes")
def get_institutes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    return db.query(EducationInstitute).all()


@router.post("/institutes")
def create_institute(
    data: InstituteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    institute = EducationInstitute(**data.dict())
    db.add(institute)
    db.commit()
    db.refresh(institute)
    return institute


@router.delete("/institutes/{institute_id}")
def delete_institute(
    institute_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    institute = db.query(EducationInstitute).filter(EducationInstitute.id == institute_id).first()
    if not institute:
        raise HTTPException(status_code=404, detail="Institute not found")

    db.delete(institute)
    db.commit()
    return {"message": "Institute deleted"}


# --- EXPENSE ROUTES ---
@router.get("/expenses")
def get_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    return db.query(Expense).all()


@router.post("/expenses")
def create_expense(
    data: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    expense = Expense(**data.dict())
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@router.delete("/expenses/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted"}


# --- NOTIFICATION ROUTES ---
@router.get("/notifications")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user_role = current_user.role.upper().replace(" ", "_").strip() if current_user.role else ""
    user_email = current_user.email

    return db.query(Notification).filter(
        or_(
            Notification.target_type == "ALL",
            (Notification.target_type == "EMAIL") & (Notification.target_value == user_email),
            (Notification.target_type == "ROLE") & (Notification.target_value == user_role),
        )
    ).all()


@router.post("/notifications")
def create_notification(
    data: NotificationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    notification = Notification(**data.dict())
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


@router.delete("/notifications/{notification_id}")
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")

    db.delete(notification)
    db.commit()
    return {"message": "Notification deleted"}


# --- TASK ROUTES ---
@router.get("/tasks")
def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    return db.query(Task).all()


@router.post("/tasks")
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    task = Task(**data.dict())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.patch("/tasks/{task_id}/status")
def update_task_status(
    task_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.status = status
    db.commit()
    db.refresh(task)
    return task


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_super_admin),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}