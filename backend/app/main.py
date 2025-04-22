from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import Base, engine 
from app.api import routes
from fastapi.staticfiles import StaticFiles


Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="Zambian KYC OCR API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routes from routes.py
app.include_router(routes.router)
app.include_router(routes.router, prefix="/api")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
