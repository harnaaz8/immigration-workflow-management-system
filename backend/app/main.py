from fastapi import FastAPI
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Database Core Imports
from app.models.user import User
from app.database.database import SessionLocal, Base, engine
from app.core.seed import seed_super_admin
from app.core.config import settings

# Route Endpoints Routing Registry
from app.routers.user import router as user_router
from app.routers.auth import router as auth_router
from app.routers import (
    enquiry,
    counselling,
    admission,
    enrollment,
    student,
    visa,
    document,
    dashboard,
    superadmin
)


# 1. Initialize FastAPI
app = FastAPI(title=settings.app_name)

# 2. Rate Limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# 3. CORS FIRST — before anything else
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Static mount AFTER CORS
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# 5. Tables + seed
Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    seed_super_admin(db)
finally:
    db.close()

# 6. Routers
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(student.router)
app.include_router(enquiry.router)
app.include_router(counselling.router)
app.include_router(admission.router)
app.include_router(enrollment.router)
app.include_router(visa.router)
app.include_router(document.router)
app.include_router(dashboard.router)
app.include_router(superadmin.router)

@app.get("/")
def root():
    return {"message": "Welcome to E_Munch"}