from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Activity, Project, User
from ..schemas.responses import ActivityResponse
from ..dependencies import get_current_project, get_current_user

router = APIRouter()

@router.get("/{project_id}", response_model=List[ActivityResponse])
def get_activities(project: Project = Depends(get_current_project), db: Session = Depends(get_db)):
    return (
        db.query(Activity)
        .filter(Activity.project_id == project.id)
        .order_by(Activity.created_at.desc())
        .all()
    )

@router.get("/", response_model=List[ActivityResponse])
def get_all_activities(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Activity)
        .join(Project, Activity.project_id == Project.id)
        .filter(Project.organization_id == current_user.organization_id)
        .order_by(Activity.created_at.desc())
        .limit(100)
        .all()
    )
