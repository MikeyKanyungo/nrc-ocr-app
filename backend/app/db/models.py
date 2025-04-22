from sqlalchemy import Column, Integer, String, Text
from app.db.database import Base

class UserKYC(Base):
    __tablename__ = "user_kyc"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    nrc_number = Column(String, unique=True, index=True)
    date_of_birth = Column(String)
    address = Column(String)
    face_image_path = Column(String)
    id_front_image_path = Column(String)
    id_back_image_path = Column(String)
