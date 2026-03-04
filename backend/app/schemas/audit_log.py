from datetime import datetime
from pydantic import BaseModel


class AuditLogOut(BaseModel):
    id: str
    timestamp: datetime
    action_type: str
    entity: str
    entity_id: str
    performed_by: str
    old_value: str
    new_value: str

    class Config:
        from_attributes = True
