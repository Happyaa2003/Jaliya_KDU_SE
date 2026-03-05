import uuid
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import get_password_hash


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_all_users(db: Session) -> List[User]:
    return db.query(User).order_by(User.email).all()


def create_user(db: Session, email: str, password: str, full_name: str = "Administrator") -> User:
    user = User(
        id=str(uuid.uuid4()),
        email=email,
        hashed_password=get_password_hash(password),
        full_name=full_name,
    )
    db.add(user)
    db.flush()
    return user


def update_password(db: Session, user_id: str, new_password: str) -> Optional[User]:
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: str) -> bool:
    user = get_user_by_id(db, user_id)
    if not user:
        return False
    db.delete(user)
    db.commit()
    return True
