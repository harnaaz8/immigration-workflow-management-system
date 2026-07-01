from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime

from sqlalchemy.sql import func

from app.database.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(
        Integer,
        ForeignKey("students.id"),
        nullable=False
    )

    document_type = Column(String)

    file_name = Column(String)

    file_path = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    stage = Column(String, nullable=False)

    uploaded_by = Column(String, nullable=False)