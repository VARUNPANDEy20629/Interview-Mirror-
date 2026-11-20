import re

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, Field

router = APIRouter(prefix="/speech", tags=["speech"])


@router.post("/transcribe")
def transcribe():
    raise HTTPException(501, "Whisper transcription (run as a background job)")


class SpeechAnalysisRequest(BaseModel):
    transcript: str = Field(min_length=1, max_length=20_000)
    duration_seconds: float = Field(default=60, ge=1, le=3600)


@router.post("/analyze")
def analyze(payload: SpeechAnalysisRequest):
    words = re.findall(r"\b[\w'-]+\b", payload.transcript)
    lowered = payload.transcript.lower()
    fillers = ["um", "uh", "like", "you know", "actually", "basically"]
    filler_count = sum(lowered.count(filler) for filler in fillers)
    duration_minutes = payload.duration_seconds / 60
    pace = round(len(words) / duration_minutes) if duration_minutes else 0
    return {"word_count": len(words), "filler_count": filler_count, "pace_wpm": pace,
            "duration_seconds": payload.duration_seconds,
            "pauses": payload.transcript.count("..."),
            "answer_length": "short" if len(words) < 40 else "medium" if len(words) < 100 else "long"}
