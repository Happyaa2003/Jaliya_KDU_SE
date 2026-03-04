from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    email: str
    full_name: str


class CreateUserRequest(BaseModel):
    email: str
    password: str
    full_name: str = "Administrator"


class ChangePasswordRequest(BaseModel):
    user_id: str
    new_password: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str

    class Config:
        from_attributes = True
