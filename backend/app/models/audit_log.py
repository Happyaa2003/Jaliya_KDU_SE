from sqlalchemy import Column, String, DateTime, Text, func
from app.core.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    action_type = Column(String, nullable=False)
    entity = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)
    performed_by = Column(String, nullable=False)
    old_value = Column(Text, default="")
    new_value = Column(Text, default="")
