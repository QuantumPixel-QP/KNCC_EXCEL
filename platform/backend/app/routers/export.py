from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Project
from ..services.excel_sync import sync_excel_for_project
from fastapi.responses import FileResponse
import os
from ..dependencies import get_current_project

router = APIRouter()

@router.post("/{project_id}")
def export_excel(project: Project = Depends(get_current_project), db: Session = Depends(get_db)):
        
    export_path = sync_excel_for_project(db, project)
    if not os.path.exists(export_path):
        raise HTTPException(status_code=500, detail="Failed to generate Excel")
        
    return FileResponse(export_path, filename=os.path.basename(export_path))
