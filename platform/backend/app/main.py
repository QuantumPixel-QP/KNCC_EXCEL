"""
KNCC Platform — Backend API (FastAPI)
Fixes applied:
  - UPLOAD_DIR and EXPORT_DIR created on startup from config
  - CORS enabled for Electron/Vite dev server
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db, SessionLocal
from .routers import api_router
from .config import UPLOAD_DIR, EXPORT_DIR

# Ensure required directories exist at startup
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(EXPORT_DIR, exist_ok=True)

app = FastAPI(title="KNCC Platform API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def seed_demo_accounts():
    from .models.user import User
    from .models.organization import Organization
    from .core.security import get_password_hash
    db = SessionLocal()
    try:
        # Check if org exists
        org = db.query(Organization).filter_by(name="KNCC Demo Org").first()
        if not org:
            org = Organization(name="KNCC Demo Org")
            db.add(org)
            db.commit()
            db.refresh(org)
        
        # Admin
        if not db.query(User).filter_by(email="admin@kncc.com").first():
            admin = User(
                email="admin@kncc.com",
                name="Demo Admin",
                hashed_password=get_password_hash("password123"),
                role="admin",
                organization_id=org.id
            )
            db.add(admin)
            
        # Engineer
        if not db.query(User).filter_by(email="engineer@kncc.com").first():
            engineer = User(
                email="engineer@kncc.com",
                name="Demo Engineer",
                hashed_password=get_password_hash("password123"),
                role="member",
                organization_id=org.id
            )
            db.add(engineer)
            
        db.commit()
    finally:
        db.close()

@app.on_event("startup")
def on_startup():
    init_db()
    seed_demo_accounts()

app.include_router(api_router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}
