from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/auth", tags=["auth"])

# TODO: hash passwords (bcrypt), issue short-lived JWT in an httpOnly cookie, add refresh/revocation.


@router.post("/register")
def register():
    raise HTTPException(501, "Not implemented yet")


@router.post("/login")
def login():
    raise HTTPException(501, "Not implemented yet")


@router.get("/me")
def me():
    raise HTTPException(501, "Not implemented yet")


@router.post("/logout")
def logout():
    raise HTTPException(501, "Not implemented yet")
