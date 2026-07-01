from sqlalchemy.orm import Session

from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from app.database.dependencies import get_db
from app.core.auth import require_role
from app.models.student import Student
from app.models.enrollment import Enrollment

from app.schemas.enrollment import EnrollmentCreate

router = APIRouter(
    prefix="/enrollments",
    tags=["Enrollments"]
)


@router.post("")
def create_enrollment(
    data: EnrollmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(
        require_role("ENROLLMENT_OFFICER")
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

    enrollment = Enrollment(
        student_id=data.student_id,
        university_name=data.university_name,
        course_name=data.course_name,
        offer_letter_number=data.offer_letter_number,
        tuition_fee=data.tuition_fee,
        notes=data.notes
    )

    student.status = "VISA_PROCESSING"

    db.add(enrollment)

    db.commit()

    db.refresh(enrollment)

    return {
        "message": "Enrollment completed",
        "enrollment_id": enrollment.id
    }


@router.get("")
def get_enrollments(
    db: Session = Depends(get_db)
):
    return db.query(Enrollment).all()


@router.get("/{enrollment_id}")
def get_enrollment(
    enrollment_id: int,
    db: Session = Depends(get_db)
):

    enrollment = db.query(Enrollment).filter(
        Enrollment.id == enrollment_id
    ).first()

    if not enrollment:
        raise HTTPException(
            status_code=404,
            detail="Enrollment not found"
        )

    return enrollment