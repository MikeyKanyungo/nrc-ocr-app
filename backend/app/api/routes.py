from fastapi import APIRouter, UploadFile, File, HTTPException, Response
from fastapi.responses import JSONResponse, PlainTextResponse
from app.services import ocr #, face_match
from app.db import schemas
from app.crud.operations import save_user_kyc
from pydantic import BaseModel
import base64
from pathlib import Path
from app.services.ocr import extract_text_from_base64

router = APIRouter()

class ImageUpload(BaseModel):
    image: str  

@router.post("/ocr")
async def extract_text_from_id(payload: ImageUpload):
    result = await extract_text_from_base64(payload.image)
    return PlainTextResponse(content=result["extracted_text"], media_type="text/plain")

@router.post("/save-kyc")
async def save_kyc_data(data: schemas.UserKYC):
    try:
        success = save_user_kyc(data)
        if success:
            return JSONResponse(content={"message": "KYC data saved successfully"}, status_code=200)
        else:
            return JSONResponse(content={"message": "Failed to save KYC"}, status_code=500)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB Save error: {str(e)}")

@router.post("/upload/front")
async def upload_front_id(data: ImageUpload):
    if not data.image:
        raise HTTPException(status_code=400, detail="No image provided")

    try:
        image_data = base64.b64decode(data.image)
        
        file_path = Path("uploads/front_id.jpg")
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(file_path, "wb") as f:
            f.write(image_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving image: {str(e)}")
    print("Received front image (base64):", data.image[:30])  
    return {"message": "Front ID uploaded successfully"}


@router.post("/upload/back")
async def upload_back_id(data: ImageUpload):
    if not data.image:
        raise HTTPException(status_code=400, detail="No image provided")

    try:
        image_data = base64.b64decode(data.image)
        
        file_path = Path("uploads/back_id.jpg")
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(file_path, "wb") as f:
            f.write(image_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving image: {str(e)}")
    print("Received back image (base64):", data.image[:30])  
    return {"message": "Back ID uploaded successfully"}
