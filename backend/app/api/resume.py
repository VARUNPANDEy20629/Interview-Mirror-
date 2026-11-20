from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/resumes", tags=["resumes"])


@router.post("/upload")
def upload():
    # Validate content type and size (settings.max_resume_mb) before processing.
    raise HTTPException(501, "Not implemented yet")


@router.get("/{resume_id}")
def details(resume_id: str):
    raise HTTPException(501, "Not implemented yet")


@router.post("/{resume_id}/analyze")
def analyze(resume_id: str):
    raise HTTPException(501, "Not implemented yet")
