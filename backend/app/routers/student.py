import os
import shutil
from datetime import datetime
from sqlalchemy.orm import Session
from typing import Optional
from app.services.email_service import send_student_credentials_email, send_visa_completion_email
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form

from app.core.auth import require_role, get_current_user, get_current_super_admin
from app.models.student import Student
from app.database.dependencies import get_db
from app.models.user import User
from app.models.enquiry import Enquiry
from app.models.counselling import Counselling
from app.models.admission import Admission
from app.models.enrollment import Enrollment
from app.models.visa import Visa
from app.models.document import Document
from app.schemas.student import AssignOfficerRequest
from app.core.security import hash_password
from app.services.email_service import send_student_credentials_email

router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


@router.post("")
def create_student(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    phone: str = Form(""),
    dob: str = Form(""),
    gender: str = Form(""),
    nationality: str = Form(""),
    passport_number: str = Form(""),
    preferred_country: str = Form(""),
    preferred_intake: str = Form(""),
    photo: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(require_role("RECEPTIONIST"))
):
    existing_student = db.query(Student).filter(
        Student.email == email
    ).first()

    if existing_student:
        raise HTTPException(
            status_code=400,
            detail="Student email already exists"
        )

    # Clean target directory handling to save image files safely
    saved_photo_path = None
    if photo:
        try:
            UPLOAD_DIR = "uploads"
            os.makedirs(UPLOAD_DIR, exist_ok=True)
            
            timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
            clean_filename = f"{timestamp}_{photo.filename.replace(' ', '_')}"
            full_storage_path = os.path.join(UPLOAD_DIR, clean_filename)
            
            with open(full_storage_path, "wb") as buffer:
                shutil.copyfileobj(photo.file, buffer)
                
            saved_photo_path = full_storage_path
        except Exception as e:
            print(f"File handling directory exception: {str(e)}")

    total_students = db.query(Student).count()
    student_code = f"STU{total_students + 1:04d}"

    student = Student(
        student_code=student_code,
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        dob=dob,
        gender=gender,
        nationality=nationality,
        passport_number=passport_number,
        preferred_country=preferred_country,
        status="ENQUIRY",
        full_name=f"{first_name} {last_name}",
        preferred_intake=preferred_intake,
        photo_path=saved_photo_path
    )

    db.add(student)
    db.commit()
    db.refresh(student)

    student_user = User(
        name=f"{first_name} {last_name}",
        email=email,
        password=hash_password(password),
        role="STUDENT"
    )

    db.add(student_user)
    db.commit()

    send_student_credentials_email(
        student_name=f"{first_name} {last_name}",
        student_email=email,
        password=password
    )

    return {
        "message": "Student created successfully",
        "student_code": student.student_code,
        "photo_path": saved_photo_path
    }


@router.get("")
def get_students(db: Session = Depends(get_db)):
    return db.query(Student).all()


@router.get("/search")
def search_students(
    name: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Student)

    if name:
        query = query.filter(Student.first_name.contains(name))

    if status:
        query = query.filter(Student.status == status)

    return query.all()


@router.get("/my-dashboard")
def student_dashboard(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = (
        db.query(Student)
        .filter(Student.email == current_user.email)
        .first()
    )

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "student_id": student.id,
        "name": student.full_name,
        "email": student.email,
        "status": student.status,
        "assigned_enquiry_officer": student.assigned_enquiry_officer,
        "assigned_counsellor": student.assigned_counsellor,
        "assigned_admission_officer": student.assigned_admission_officer,
        "assigned_enrollment_officer": student.assigned_enrollment_officer,
        "assigned_visa_officer": student.assigned_visa_officer
    }


@router.get("/assigned/enquiry/{officer_name}")
def get_enquiry_students(officer_name: str, db: Session = Depends(get_db)):
    return db.query(Student).filter(
        Student.assigned_enquiry_officer == officer_name
    ).all()


@router.get("/assigned/counsellor/{officer_name}")
def get_counsellor_students(officer_name: str, db: Session = Depends(get_db)):
    return db.query(Student).filter(
        Student.assigned_counsellor == officer_name
    ).all()


@router.get("/assigned/admission/{officer_name}")
def get_admission_students(officer_name: str, db: Session = Depends(get_db)):
    return db.query(Student).filter(
        Student.assigned_admission_officer == officer_name
    ).all()


@router.get("/assigned/enrollment/{officer_name}")
def get_enrollment_students(officer_name: str, db: Session = Depends(get_db)):
    return db.query(Student).filter(
        Student.assigned_enrollment_officer == officer_name
    ).all()


@router.get("/assigned/visa/{officer_name}")
def get_visa_students(officer_name: str, db: Session = Depends(get_db)):
    return db.query(Student).filter(
        Student.assigned_visa_officer == officer_name
    ).all()


@router.get("/{student_id}/details")
def get_student_details(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Ensure these queries are active
    enquiry = db.query(Enquiry).filter(Enquiry.student_id == student_id).first()
    counselling = db.query(Counselling).filter(Counselling.student_id == student_id).first()
    admission = db.query(Admission).filter(Admission.student_id == student_id).first()
    enrollment = db.query(Enrollment).filter(Enrollment.student_id == student_id).first()
    visa = db.query(Visa).filter(Visa.student_id == student_id).first()
    
    # THIS IS THE KEY PART: Make sure this query runs!
    documents = db.query(Document).filter(Document.student_id == student_id).all()

    return {
        "student": student,
        "enquiry": enquiry,
        "counselling": counselling,
        "admission": admission,
        "enrollment": enrollment,
        "visa": visa,
        "documents": documents # Ensure this is being returned
    }


@router.get("/{student_id}/timeline")
def get_student_timeline(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return {
        "student_id": student.id,
        "student_name": f"{student.first_name} {student.last_name}",
        "status": student.status,
        "assigned_enquiry_officer": student.assigned_enquiry_officer,
        "assigned_counsellor": student.assigned_counsellor,
        "assigned_admission_officer": student.assigned_admission_officer,
        "assigned_enrollment_officer": student.assigned_enrollment_officer,
        "assigned_visa_officer": student.assigned_visa_officer
    }


@router.get("/{student_id}")
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    return student


@router.patch("/assign-enquiry/{student_id}")
def assign_enquiry_officer(
    student_id: int,
    data: AssignOfficerRequest,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.assigned_enquiry_officer = data.officer_name
    db.commit()
    return {"message": "Enquiry officer assigned successfully"}


@router.patch("/assign-counsellor/{student_id}")
def assign_counsellor(
    student_id: int,
    data: AssignOfficerRequest,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.assigned_counsellor = data.officer_name
    db.commit()
    return {"message": "Counsellor assigned successfully"}


@router.patch("/assign-admission/{student_id}")
def assign_admission_officer(
    student_id: int,
    data: AssignOfficerRequest,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.assigned_admission_officer = data.officer_name
    db.commit()
    return {"message": "Admission officer assigned successfully"}


@router.patch("/assign-enrollment/{student_id}")
def assign_enrollment_officer(
    student_id: int,
    data: AssignOfficerRequest,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.assigned_enrollment_officer = data.officer_name
    db.commit()
    return {"message": "Enrollment officer assigned successfully"}


@router.patch("/assign-visa/{student_id}")
def assign_visa_officer(
    student_id: int,
    data: AssignOfficerRequest,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.assigned_visa_officer = data.officer_name
    db.commit()
    return {"message": "Visa officer assigned successfully"}


@router.patch("/complete-enquiry/{student_id}")
def complete_enquiry(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.status = "COUNSELLING"
    db.commit()
    return {"message": "Enquiry completed"}


@router.patch("/complete-counselling/{student_id}")
def complete_counselling(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.status = "ADMISSION"
    db.commit()
    return {"message": "Counselling completed"}


@router.patch("/complete-admission/{student_id}")
def complete_admission(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.status = "ENROLLMENT"
    db.commit()
    return {"message": "Admission completed"}


@router.patch("/complete-enrollment/{student_id}")
def complete_enrollment(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    student.status = "VISA"
    db.commit()
    return {"message": "Enrollment completed"}


@router.patch("/complete-visa/{student_id}")
def complete_visa(student_id: int, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.status = "COMPLETED"

    # Define paths
    UPLOAD_DIR = "uploads"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    visa_filename = f"visa_{student.student_code}.pdf"
    visa_dest_path = os.path.join(UPLOAD_DIR, visa_filename)
    
    # Use an absolute path for the source file to avoid "File Not Found" errors
    # Assuming 'demo.pdf' is in the same folder as 'main.py' or project root
    source_pdf = "demo.pdf" 
    
    if os.path.exists(source_pdf):
        if not os.path.exists(visa_dest_path):
            shutil.copy(source_pdf, visa_dest_path)
    else:
        print(f"CRITICAL ERROR: {source_pdf} not found in project root.")
        raise HTTPException(status_code=500, detail="Visa template file missing on server")

    # ... rest of your existing logic (existing_doc check, add to DB, commit, email)
    # Ensure this block is indented correctly inside the function!
    existing_doc = db.query(Document).filter(
        Document.student_id == student_id,
        Document.document_type == "VISA_APPROVAL"
    ).first()

    if not existing_doc:
        visa_doc = Document(
            student_id=student_id,
            document_type="VISA_APPROVAL",
            file_name=visa_filename,
            file_path=visa_dest_path,
            stage="VISA",
            uploaded_by="SYSTEM"
        )
        db.add(visa_doc)

    db.commit()
    # ... send email

    # Send email to student
    send_visa_completion_email(
        student_name=student.full_name,
        student_email=student.email
    )

    return {"message": "Visa completed"}


@router.patch("/update-counselling/{student_id}")
def update_counselling(
    student_id: int,
    data: dict,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.counselling_fee_status = data.get("fee_status")
    student.counselling_notes = data.get("notes")
    db.commit()

    return {"message": "Counselling updated"}


@router.patch("/update-admission/{student_id}")
def update_admission(
    student_id: int,
    data: dict,
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student.admission_fee_status = data.get("fee_status")
    student.admission_notes = data.get("notes")
    db.commit()

    return {"message": "Admission updated"}


@router.delete("/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_super_admin)  # Ensures ONLY super admin can delete
):
    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="The student record could not be found."
        )

    try:
        # Delete related workflow records first to avoid FK constraint errors
        db.query(Enquiry).filter(Enquiry.student_id == student_id).delete()
        db.query(Counselling).filter(Counselling.student_id == student_id).delete()
        db.query(Admission).filter(Admission.student_id == student_id).delete()
        db.query(Enrollment).filter(Enrollment.student_id == student_id).delete()
        db.query(Visa).filter(Visa.student_id == student_id).delete()
        db.query(Document).filter(Document.student_id == student_id).delete()

        # Delete the linked login account for this student (created at registration)
        db.query(User).filter(User.email == student.email).delete()

        # Optionally remove the uploaded profile photo from disk
        if student.photo_path and os.path.exists(student.photo_path):
            try:
                os.remove(student.photo_path)
            except Exception as file_err:
                print(f"Could not remove photo file: {file_err}")

        student_name = f"{student.first_name} {student.last_name}"
        db.delete(student)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete student due to linked database dependencies: {str(e)}"
        )

    return {"message": f"Successfully deleted student profile for {student_name}"}