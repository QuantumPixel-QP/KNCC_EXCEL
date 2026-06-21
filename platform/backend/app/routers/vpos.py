from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import VPO, Project
from ..dependencies import get_current_project

router = APIRouter()

@router.get("/{project_id}")
def get_vpos(project: Project = Depends(get_current_project), db: Session = Depends(get_db)):
    return db.query(VPO).filter(VPO.project_id == project.id).all()
