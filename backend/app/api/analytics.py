from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard")
def dashboard():
    raise HTTPException(501, "Not implemented yet")


@router.get("/progress")
def progress():
    raise HTTPException(501, "Not implemented yet")


@router.get("/weak-topics")
def weak_topics():
    raise HTTPException(501, "Not implemented yet")
