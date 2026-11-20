from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/interviews", tags=["interviews"])

for_later = "Not implemented yet"


@router.post("/create")
def create():
    raise HTTPException(501, for_later)


@router.post("/{interview_id}/start")
def start(interview_id: str):
    raise HTTPException(501, for_later)


@router.get("/{interview_id}/next-question")
def next_question(interview_id: str):
    raise HTTPException(501, "Generate a question grounded in retrieved code (file + line range)")


@router.post("/{interview_id}/answer")
def answer(interview_id: str):
    raise HTTPException(501, "Rubric scoring + evidence comparison")


@router.post("/{interview_id}/complete")
def complete(interview_id: str):
    raise HTTPException(501, for_later)


@router.get("/{interview_id}/report")
def report(interview_id: str):
    raise HTTPException(501, for_later)
