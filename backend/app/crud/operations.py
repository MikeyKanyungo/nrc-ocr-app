from sqlalchemy.orm import Session
from app.db import models, schemas
from app.db.database import SessionLocal

def save_user_kyc(data: schemas.UserKYC) -> bool:
    db: Session = SessionLocal()
    try:
        record = models.UserKYC(**data.dict())
        db.add(record)
        db.commit()
        db.refresh(record)
        return True
    except Exception as e:
        db.rollback()
        print("Error saving to DB:", e)
        return False
    finally:
        db.close()
