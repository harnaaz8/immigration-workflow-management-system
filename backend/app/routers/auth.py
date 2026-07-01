from datetime import datetime
from datetime import timedelta

from fastapi import APIRouter
from fastapi import HTTPException
from fastapi import Response
from sqlalchemy.orm import Session

from fastapi import Depends
from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
from app.models.user import User
from app.database.dependencies import get_db
from jose import jwt

from app.core.config import settings
from app.schemas.auth import LoginRequest
from app.utils.security import verify_password


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.get("/test")
def test_auth():
    return {
        "message": "Authentication router working"
    }


# ... Rest of your imports remain the exact same ...

@router.post("/login")
@limiter.limit("5/minute")
def login(
    data: LoginRequest,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": user.email,
        "role": user.role,
        "user_id": user.id,
        "exp": expire
    }

    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    # Set token as httpOnly cookie with an explicit root path scope
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=False,         # Set to True in production with HTTPS
        path="/"             # 👈 FIXED: Explicitly sets access visibility globally across all routes
    )

    return {
        "role": user.role,
        "name": user.name
    }


@router.post("/logout")
def logout(response: Response):
    response.set_cookie(
        key="access_token",
        value="",
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=0,
        expires=0,
        path="/"        # 
    )
    return {"message": "Logged out"}