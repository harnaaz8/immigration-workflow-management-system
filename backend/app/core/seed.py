from sqlalchemy.orm import Session

from app.models.user import User
from app.utils.security import hash_password


def seed_super_admin(db: Session):

    existing_admin = (
        db.query(User)
        .filter(User.role == "SUPER_ADMIN")
        .first()
    )

    if existing_admin:
        return

    admin = User(
        name="System Admin",
        email="admin@emunch.com",
        password=hash_password("Admin@123"),
        role="SUPER_ADMIN",
        is_active=True
    )

    db.add(admin)
    db.commit()

    print("SUPER ADMIN CREATED")

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)