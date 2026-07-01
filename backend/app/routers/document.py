import os
import shutil

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import Form
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database.dependencies import get_db

from app.models.student import Student
from app.models.document import Document

from app.core.auth import get_current_user


router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


@router.post("/upload")
def upload_document(
    student_id: int = Form(...),
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
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

    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    document = Document(
        student_id=student_id,
        document_type=document_type,
        file_name=file.filename,
        file_path=file_path
    )

    db.add(document)

    db.commit()

    db.refresh(document)

    return {
        "message": "Document uploaded",
        "document_id": document.id
    }


@router.get("/student/{student_id}")
def get_student_documents(
    student_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    return (
        db.query(Document)
        .filter(
            Document.student_id == student_id
        )
        .all()
    )