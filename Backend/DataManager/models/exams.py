import json
from DataManager.database import engine
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from DataManager.database import Base
from sqlalchemy import Column, String, Integer, Boolean, PickleType, Float

class Exam(Base):
    __tablename__ = "exam_exams"
    id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    name = Column(String)
    state = Column(String)
    records = relationship("ExamRecord", back_populates="exam",
                           cascade="all, delete", passive_deletes=True)
    fullMark = Column(Float, default=100.0)

class ExamRecord(Base):
    __tablename__ = "exam_exam_records"
    id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    author_id = Column(Integer, ForeignKey(
        'account_users.id', ondelete="CASCADE"))
    exam_id = Column(Integer, ForeignKey('exam_exams.id', ondelete="CASCADE"))
    exam = relationship("Exam", back_populates="records")
    feedback = Column(PickleType)
    

Base.metadata.create_all(bind=engine)
print("Exams Created")
