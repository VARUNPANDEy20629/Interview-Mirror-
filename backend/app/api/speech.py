from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/speech", tags=["speech"])


@router.post("/transcribe")
def transcribe():
    raise HTTPException(501, "Whisper transcription (run as a background job)")


@router.post("/analyze")
def analyze():
    raise HTTPException(501, "Filler words, pace, pauses, answer length")
