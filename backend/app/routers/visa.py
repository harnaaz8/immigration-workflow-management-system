from sqlalchemy.orm import Session

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from app.database.dependencies import get_db
from app.core.auth import require_role
from app.models.student import Student
from app.models.visa import Visa
from app.schemas.visa import VisaCreate

router = APIRouter(
    prefix="/visas",
    tags=["Visas"]
)


@router.post("")
def create_visa(
    data: VisaCreate,
    db: Session = Depends(get_db),
    current_user = Depends(
        require_role("VISA_OFFICER")
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

    visa = Visa(
        student_id=data.student_id,
        visa_type=data.visa_type,
        application_number=data.application_number,
        biometric_date=data.biometric_date,
        interview_date=data.interview_date,
        decision_date=data.decision_date,
        notes=data.notes
    )

    student.status = "VISA_APPROVED"

    db.add(visa)

    db.commit()

    db.refresh(visa)

    return {
        "message": "Visa application created",
        "visa_id": visa.id
    }


@router.get("")
def get_visas(
    db: Session = Depends(get_db)
):
    return db.query(Visa).all()


@router.get("/{visa_id}")
def get_visa(
    visa_id: int,
    db: Session = Depends(get_db)
):

    visa = db.query(Visa).filter(
        Visa.id == visa_id
    ).first()

    if not visa:
        raise HTTPException(
            status_code=404,
            detail="Visa record not found"
        )

    return visa

@router.patch("/complete/{student_id}")
def complete_student_case(
    student_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_role("VISA_OFFICER")
    )
):

    student = (
        db.query(Student)
        .filter(Student.id == student_id)
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    student.status = "COMPLETED"

    db.commit()

    return {
        "message": "Student case completed"
    }