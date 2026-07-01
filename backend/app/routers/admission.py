from sqlalchemy.orm import Session

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from app.database.dependencies import get_db
from app.core.auth import require_role
from app.models.student import Student
from app.models.admission import Admission

from app.schemas.admission import AdmissionCreate

router = APIRouter(
    prefix="/admissions",
    tags=["Admissions"]
)


@router.post("")
def create_admission(
    data: AdmissionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(
        require_role("ADMISSION_OFFICER")
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

    admission = Admission(
        student_id=data.student_id,
        university_name=data.university_name,
        course_name=data.course_name,
        intake=data.intake,
        application_id=data.application_id,
        notes=data.notes
    )

    student.status = "ADMISSION"

    db.add(admission)

    db.commit()

    db.refresh(admission)

    return {
        "message": "Admission record created",
        "admission_id": admission.id
    }


@router.get("")
def get_admissions(
    db: Session = Depends(get_db)
):
    return db.query(Admission).all()


@router.get("/{admission_id}")
def get_admission(
    admission_id: int,
    db: Session = Depends(get_db)
):

    admission = db.query(Admission).filter(
        Admission.id == admission_id
    ).first()

    if not admission:
        raise HTTPException(
            status_code=404,
            detail="Admission record not found"
        )

    return admission