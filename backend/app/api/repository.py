from fastapi import APIRouter, HTTPException

router = APIRouter(tags=["repositories"])


@router.post("/repositories/analyze")
def analyze():
    # Return a job id; run parsing in a background worker and expose a status endpoint.
    raise HTTPException(501, "Not implemented yet")


@router.get("/repositories/{repo_id}")
def details(repo_id: str):
    raise HTTPException(501, "Not implemented yet")


@router.get("/repositories/{repo_id}/architecture")
def architecture(repo_id: str):
    raise HTTPException(501, "Not implemented yet")


@router.get("/code/{repo_id}/symbols")
def symbols(repo_id: str):
    raise HTTPException(501, "Not implemented yet")


@router.get("/code/{repo_id}/graph")
def graph(repo_id: str):
    raise HTTPException(501, "Not implemented yet")
