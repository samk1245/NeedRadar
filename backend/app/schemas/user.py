from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.user import UserRole

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    city: Optional[str] = "Bengaluru"
    preferred_locality: Optional[str] = None
    role: Optional[UserRole] = UserRole.RESIDENT # Regular sign up defaults to resident

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserRead"

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class UserRead(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: UserRole
    city: str
    preferred_locality: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

Token.model_rebuild()
