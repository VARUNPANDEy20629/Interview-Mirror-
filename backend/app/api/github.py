from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/github", tags=["github"])


@router.get("/connect")
def connect():
    raise HTTPException(501, "Start GitHub OAuth (read-only scopes)")


@router.get("/callback")
def callback():
    raise HTTPException(501, "Exchange code for token; store encrypted server-side")


@router.get("/repositories")
def list_repositories():
    raise HTTPException(501, "List the user's repositories")
