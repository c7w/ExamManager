from typing import Optional
from pydantic import BaseModel


class CreateUserField(BaseModel):
    user_id: int
    username: Optional[str]
    password: str
    sessionId: str

class LoginUserField(BaseModel):
    user_id: int
    password: str
    sessionId: str