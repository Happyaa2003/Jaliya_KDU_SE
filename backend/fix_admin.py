"""
Run this once to reset the admin password in the database.
Usage: python fix_admin.py
"""
import sys
import os

# Make sure app package is on path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.security import get_password_hash, verify_password
from app.models.user import User

db = SessionLocal()
try:
    user = db.query(User).filter(User.email == "admin@university.edu").first()
    if not user:
        print("ERROR: admin user not found in database!")
        sys.exit(1)

    new_hash = get_password_hash("admin123")
    user.hashed_password = new_hash
    db.commit()

    # Verify it works
    ok = verify_password("admin123", new_hash)
    print(f"✅ Password reset for {user.email}")
    print(f"   Hash prefix : {new_hash[:20]}...")
    print(f"   Verify test : {'PASSED' if ok else 'FAILED'}")
finally:
    db.close()
