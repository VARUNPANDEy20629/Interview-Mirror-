from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse
from urllib.parse import urlencode

from app.config import settings

from app.core.store import store

router = APIRouter(prefix="/github", tags=["github"])


@router.get("/connect")
def connect():
    if not settings.github_client_id:
        raise HTTPException(503, "GitHub OAuth is not configured")
    params = urlencode({
        "client_id": settings.github_client_id,
        "scope": "read:user repo",
        "redirect_uri": "/api/v1/github/callback",
    })
    return RedirectResponse(f"https://github.com/login/oauth/authorize?{params}")


@router.get("/callback")
def callback(code: str | None = None):
    if not code:
        raise HTTPException(400, "Missing GitHub OAuth code")
    if not settings.github_client_id or not settings.github_client_secret:
        raise HTTPException(503, "GitHub OAuth is not configured")
    raise HTTPException(501, "Exchange the OAuth code and encrypt the access token before persistence")


@router.get("/repositories")
def list_repositories():
    repositories = store.list_repositories()
    if not repositories:
        return []
    return [{"id": item["id"], "name": item["name"], "languages": item["languages"],
             "files": item["files"], "classes": item["classes"], "functions": item["functions"],
             "status": item["status"], "branch": item["branch"]}
            for item in repositories]
