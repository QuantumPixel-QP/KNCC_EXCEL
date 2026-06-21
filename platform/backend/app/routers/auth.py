from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from ..database import get_db
from ..models.user import User
from ..models.organization import Organization
from ..core.security import verify_password, get_password_hash, create_access_token
from ..dependencies import get_current_user

router = APIRouter()

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    organization_name: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict
    organization: dict

@router.post("/register", response_model=Token)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # Find or create organization
    org = db.query(Organization).filter(Organization.name == user_in.organization_name).first()
    if not org:
        org = Organization(name=user_in.organization_name)
        db.add(org)
        db.commit()
        db.refresh(org)
        role = "admin" # First user in new org is admin
    else:
        role = "member"

    # Create user
    new_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        name=user_in.name,
        organization_id=org.id,
        role=role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate token
    access_token = create_access_token(data={"sub": str(new_user.id), "org_id": org.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": new_user.id, "email": new_user.email, "name": new_user.name, "role": new_user.role},
        "organization": {"id": org.id, "name": org.name}
    }

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    org = db.query(Organization).filter(Organization.id == user.organization_id).first()
    
    access_token = create_access_token(data={"sub": str(user.id), "org_id": org.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "name": user.name, "role": user.role},
        "organization": {"id": org.id, "name": org.name}
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = db.query(Organization).filter(Organization.id == current_user.organization_id).first()
    return {
        "user": {"id": current_user.id, "email": current_user.email, "name": current_user.name, "role": current_user.role},
        "organization": {"id": org.id, "name": org.name}
    }
