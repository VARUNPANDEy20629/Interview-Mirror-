from fastapi import APIRouter, HTTPException, UploadFile, File

from app.core.store import store
from app.config import settings

router = APIRouter(prefix="/resumes", tags=["resumes"])


@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    content_type = file.content_type
    content = await file.read()
    if content_type != "application/pdf" and not file.filename.lower().endswith(".pdf"):
        raise HTTPException(415, "Resume must be a PDF")
    if len(content) > settings.max_resume_mb * 1024 * 1024:
        raise HTTPException(413, "Resume exceeds the 5 MB upload limit")
    resume_id = store.create_id("resume")
    resume = {"id": resume_id, "filename": file.filename, "size": len(content),
              "content_type": content_type, "status": "uploaded", "skills": [], "projects": []}
    store.save_resume(resume)
    return resume


@router.get("/{resume_id}")
def details(resume_id: str):
    resume = store.get_resume(resume_id)
    if not resume:
        raise HTTPException(404, "Resume not found")
    return resume


@router.post("/{resume_id}/analyze")
def analyze(resume_id: str):
    resume = store.get_resume(resume_id)
    if not resume:
        raise HTTPException(404, "Resume not found")
    resume["status"] = "analyzed"
    resume["skills"] = ["Communication", "Problem solving"]
    resume["projects"] = []
    store.save_resume(resume)
    return resume
