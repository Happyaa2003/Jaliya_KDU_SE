import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog


def get_all_logs(db: Session, skip: int = 0, limit: int = 100) -> List[AuditLog]:
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).offset(skip).limit(limit).all()


def create_log(
    db: Session,
    action_type: str,
    entity: str,
    entity_id: str,
    performed_by: str,
    old_value: str = "",
    new_value: str = "",
) -> AuditLog:
    log = AuditLog(
        id=str(uuid.uuid4()),
        action_type=action_type,
        entity=entity,
        entity_id=entity_id,
        performed_by=performed_by,
        old_value=old_value,
        new_value=new_value,
    )
    db.add(log)
    db.flush()
    return log
