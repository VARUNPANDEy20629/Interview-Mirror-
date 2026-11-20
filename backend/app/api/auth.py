from fastapi import APIRouter, HTTPException, Response, Request
from pydantic import BaseModel, EmailStr, Field

from app.core.security import create_access_token, decode_access_token, hash_password, verify_password
from app.core.store import store

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


def current_user(request: Request) -> dict:
    token = request.cookies.get("im_token")
    if not token:
        raise HTTPException(401, "Authentication required")
    email = decode_access_token(token)
    user = store.get_user_by_email(email) if email else None
    if not user:
        raise HTTPException(401, "Invalid or expired session")
    return user


@router.post("/register")
def register(payload: RegisterRequest, response: Response):
    if store.get_user_by_email(str(payload.email)):
        raise HTTPException(409, "An account with this email already exists")
    user = {"id": store.create_id("user"), "name": payload.name.strip(),
            "email": str(payload.email).lower(), "password_hash": hash_password(payload.password)}
    store.save_user(user)
    token = create_access_token(user["email"])
    response.set_cookie("im_token", token, httponly=True, samesite="lax", max_age=30 * 60)
    return {"id": user["id"], "name": user["name"], "email": user["email"]}


@router.post("/login")
def login(payload: LoginRequest, response: Response):
    user = store.get_user_by_email(str(payload.email))
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    token = create_access_token(user["email"])
    response.set_cookie("im_token", token, httponly=True, samesite="lax", max_age=30 * 60)
    return {"id": user["id"], "name": user["name"], "email": user["email"]}


@router.get("/me")
def me(request: Request):
    user = current_user(request)
    return {"id": user["id"], "name": user["name"], "email": user["email"]}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("im_token")
    return {"status": "logged_out"}
