"""
KNCC Platform — Backend API (FastAPI)
Fixes applied:
  - UPLOAD_DIR and EXPORT_DIR created on startup from config
  - CORS enabled for Electron/Vite dev server
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
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

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(api_router, prefix="/api")

@app.get("/health")
def health_check():
    return {"status": "ok"}
