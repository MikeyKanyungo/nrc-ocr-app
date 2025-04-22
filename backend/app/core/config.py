from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "KYC OCR Backend"
    DATABASE_URL: str = "sqlite:///./kyc.db"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173"]  # Vite frontend URL

    class Config:
        env_file = ".env"


settings = Settings()