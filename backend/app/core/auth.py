from fastapi import Depends, HTTPException, Cookie
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.database.dependencies import get_db
from app.models.user import User

def get_current_user(
    access_token: str = Cookie(None),
    db: Session = Depends(get_db)
):
    if not access_token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    try:
        payload = jwt.decode(
            access_token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id = payload.get("user_id")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user


def get_current_super_admin(
    current_user: User = Depends(get_current_user)
):
    # ✅ FIX: Converts "Super Admin", "super_admin", or "SUPER_ADMIN" all safely into "SUPER_ADMIN"
    normalized_role = current_user.role.upper().replace(" ", "_").strip() if current_user.role else ""
    
    if normalized_role != "SUPER_ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Only Super Admin allowed"
        )

    return current_user


def require_role(required_role: str):
    def role_checker(
        current_user: User = Depends(get_current_user)
    ):
        # ✅ FIX: Normalizes general role strings as well to prevent matching issues across views
        user_role = current_user.role.upper().replace(" ", "_").strip() if current_user.role else ""
        target_role = required_role.upper().replace(" ", "_").strip()
        
        if user_role != target_role:
            raise HTTPException(
                status_code=403,
                detail="Permission denied"
            )

        return current_user

    return role_checker