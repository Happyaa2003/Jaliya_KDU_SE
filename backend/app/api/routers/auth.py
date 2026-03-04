from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, create_access_token, decode_token
from app.repositories import user_repo
from app.schemas.auth import (
    LoginRequest, TokenResponse,
    CreateUserRequest, ChangePasswordRequest, UserResponse,
)
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List

router = APIRouter(prefix="/api/auth", tags=["auth"])
bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    user = user_repo.get_user_by_email(db, payload.get("sub", ""))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = user_repo.get_user_by_email(db, data.email)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    token = create_access_token({"sub": user.email})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        email=user.email,
        full_name=user.full_name,
    )


@router.get("/users", response_model=List[UserResponse])
def list_users(
    _current=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all admin users. Requires authentication."""
    return user_repo.get_all_users(db)


@router.post("/users", response_model=UserResponse, status_code=201)
def create_user(
    data: CreateUserRequest,
    _current=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new admin user. Requires authentication."""
    existing = user_repo.get_user_by_email(db, data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists",
        )
    new_user = user_repo.create_user(db, data.email, data.password, data.full_name)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.put("/users/{user_id}/password", response_model=UserResponse)
def change_password(
    user_id: str,
    data: ChangePasswordRequest,
    _current=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Change a user's password. Requires authentication."""
    updated = user_repo.update_password(db, user_id, data.new_password)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated
