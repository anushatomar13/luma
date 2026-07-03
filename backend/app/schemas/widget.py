import datetime as dt

from pydantic import BaseModel, ConfigDict


class SyncJobRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    provider: str
    status: str
    created_at: dt.datetime
    finished_at: dt.datetime | None
