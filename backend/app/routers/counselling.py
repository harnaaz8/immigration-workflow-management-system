from sqlalchemy.orm import Session

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from app.core.auth import require_role
from app.database.dependencies import get_db

from app.models.student import Student
from app.models.counselling import Counselling

from app.schemas.counselling import CounsellingCreate

router = APIRouter(
    prefix="/counselling",
    tags=["Counselling"]
)


@router.post("")
def create_counselling(
    data: CounsellingCreate,
    db: Session = Depends(get_db),
    current_user = Depends(
        require_role("COUNSELLOR")
    )
):

    student = db.query(Student).filter(
        Student.id == data.student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    counselling = Counselling(
        student_id=data.student_id,
        recommended_country=data.recommended_country,
        recommended_university=data.recommended_university,
        recommended_course=data.recommended_course,
        intake=data.intake,
        notes=data.notes
    )

    student.status = "COUNSELLING"

    db.add(counselling)

    db.commit()

    db.refresh(counselling)

    return {
        "message": "Counselling completed",
        "counselling_id": counselling.id
    }


@router.get("")
def get_counselling(
    db: Session = Depends(get_db)
):
    return db.query(Counselling).all()


@router.get("/{counselling_id}")
def get_single_counselling(
    counselling_id: int,
    db: Session = Depends(get_db)
):

    counselling = db.query(Counselling).filter(
        Counselling.id == counselling_id
    ).first()

    if not counselling:
        raise HTTPException(
            status_code=404,
            detail="Counselling record not found"
        )

    return counselling