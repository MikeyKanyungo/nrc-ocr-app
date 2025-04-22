from pydantic import BaseModel

class UserKYC(BaseModel):
    full_name: str
    nrc_number: str
    date_of_birth: str
    address: str
    face_image_path: str
    id_front_image_path: str
    id_back_image_path: str

    class Config:
        orm_mode = True
