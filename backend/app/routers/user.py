from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# Core Application Imports
from app.core.auth import get_current_user, get_current_super_admin
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.user import CreateUserRequest
from app.utils.security import hash_password
from app.services.email_service import send_staff_credentials_email

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/create-staff")
def create_staff(
    data: CreateUserRequest,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_super_admin)
):
    existing_user = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        role=data.role.value
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    try:
        send_staff_credentials_email(
            staff_name=user.name,
            staff_email=user.email,
            password=data.password
        )
    except Exception as e:
        print("Email Error:", e)

    return {
        "message": "Staff Created",
        "id": user.id
    }

@router.get("")
def get_users(
    db: Session = Depends(get_db)
):
    return db.query(User).all()


@router.get("/my-profile")
def my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "active": current_user.is_active
    }


# 👇 NEW: Delete Staff Member Endpoint (Only accessible by Super Admin)
@router.delete("/{user_id}")
def delete_staff_member(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_super_admin)
):
    # Safeguard: Prevent the logged-in super admin from deleting themselves
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="Administrative failure: You cannot delete your own logged-in session account."
        )

    staff_member = db.query(User).filter(User.id == user_id).first()
    if not staff_member:
        raise HTTPException(
            status_code=404,
            detail="The requested staff member record could not be found."
        )

    db.delete(staff_member)
    db.commit()

    return {"message": f"Successfully purged record for account: {staff_member.name}"}