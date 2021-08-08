from typing import Optional
from pydantic import BaseModel

class CreateUser(BaseModel):
    id: int
    username: Optional[str] = id
    password = str
    