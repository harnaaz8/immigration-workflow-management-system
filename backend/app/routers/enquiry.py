from sqlalchemy.orm import Session

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from app.core.auth import require_role
from app.database.dependencies import get_db

from app.models.student import Student
from app.models.enquiry import Enquiry

from app.schemas.enquiry import EnquiryCreate

router = APIRouter(
    prefix="/enquiries",
    tags=["Enquiries"]
)


@router.post("")
def create_enquiry(
    data: EnquiryCreate,
    db: Session = Depends(get_db),
    current_user = Depends(
        require_role("ENQUIRY_OFFICER")
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

    enquiry = Enquiry(
        student_id=data.student_id,
        academic_background=data.academic_background,
        english_test_type=data.english_test_type,
        english_score=data.english_score,
        work_experience=data.work_experience,
        funding_source=data.funding_source,
        notes=data.notes
    )

    student.status = "ENQUIRY"

    db.add(enquiry)

    db.commit()

    db.refresh(enquiry)

    return {
    "message": "Enquiry created",
    "enquiry_id": enquiry.id
}


@router.get("")
def get_enquiries(
    db: Session = Depends(get_db)
):
    return db.query(Enquiry).all()


@router.get("/{enquiry_id}")
def get_enquiry(
    enquiry_id: int,
    db: Session = Depends(get_db)
):

    enquiry = db.query(Enquiry).filter(
        Enquiry.id == enquiry_id
    ).first()

    if not enquiry:
        raise HTTPException(
            status_code=404,
            detail="Enquiry not found"
        )

    return enquiry