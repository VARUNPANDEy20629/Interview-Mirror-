from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.core.store import store

router = APIRouter(prefix="/interviews", tags=["interviews"])

class CreateInterviewRequest(BaseModel):
    repository_id: str | None = None
    type: str = "project-defense"


class AnswerRequest(BaseModel):
    question_id: str
    answer: str = Field(min_length=1, max_length=20_000)


def _questions(repository_id: str | None) -> list[dict]:
    repository = store.get_repository(repository_id) if repository_id else None
    if repository:
        for symbol in repository.get("symbols", []):
            functions = symbol.get("functions", [])
            if functions:
                function = functions[0]
                lines = [f"def {function['name']}(...):" if symbol["language"] == "Python"
                         else f"{function['name']}(...);"]
                evidence = {
                    "file": symbol["file"],
                    "startLine": function["start_line"],
                    "lines": lines,
                    "highlight": [1],
                }
                text = f"Walk me through {function['name']} in {symbol['file']}. What does it do, and what trade-offs might it have?"
                return [{
                    "id": "q1",
                    "category": "Code explanation",
                    "difficulty": "Intermediate",
                    "text": text,
                    "keywords": [function["name"].lower(), "why", "complexity", "test", "input", "return"],
                    "evidence": evidence,
                }]
    return [{
        "id": "q1",
        "category": "Code explanation",
        "difficulty": "Intermediate",
        "text": "Walk me through the main function in this project. What problem does it solve and what trade-offs did you make?",
        "keywords": ["function", "problem", "trade-off", "why", "input", "output", "test"],
        "evidence": {"file": "README.md", "startLine": 1, "lines": ["Project overview"], "highlight": [1]},
    }]


def _evaluate(question: dict, answer: str) -> dict:
    text = answer.lower()
    words = [word for word in text.split() if word]
    keyword_hits = sum(1 for keyword in question["keywords"] if keyword in text)
    coverage = min(1.0, keyword_hits / max(3, len(question["keywords"]) * 0.55))
    length = min(1.0, len(words) / 60)
    example = bool(any(marker in text for marker in ("for example", "for instance", "e.g.", "such as")))
    scores = {
        "correctness": round(max(20, 35 + coverage * 55)),
        "relevance": round(max(20, 40 + coverage * 50)),
        "completeness": round(max(20, 25 + length * 45 + coverage * 20)),
        "structure": round(max(20, 30 + length * 55)),
        "examples": round(max(20, 25 + (50 if example else 10) + coverage * 15)),
    }
    feedback = []
    if coverage < 0.5:
        feedback.append("Mention more of the code concepts and responsibilities relevant to this function.")
    if len(words) < 40:
        feedback.append("Give a fuller explanation of what happens, why it was chosen, and possible trade-offs.")
    if not example:
        feedback.append("Add a concrete example or input/output to demonstrate your understanding.")
    if not feedback:
        feedback.append("Strong answer. You could add alternatives or edge cases.")
    return {"scores": scores, "feedback": feedback}


@router.post("/create")
def create(payload: CreateInterviewRequest):
    if payload.repository_id and not store.get_repository(payload.repository_id):
        raise HTTPException(404, "Repository not found")
    interview_id = store.create_id("interview")
    interview = {"id": interview_id, "repository_id": payload.repository_id,
                 "type": payload.type, "status": "created", "answers": []}
    store.save_interview(interview)
    return interview


@router.post("/{interview_id}/start")
def start(interview_id: str):
    interview = store.get_interview(interview_id)
    if not interview:
        raise HTTPException(404, "Interview not found")
    interview["status"] = "in_progress"
    store.save_interview(interview)
    return interview


@router.get("/{interview_id}/next-question")
def next_question(interview_id: str):
    interview = store.get_interview(interview_id)
    if not interview:
        raise HTTPException(404, "Interview not found")
    questions = _questions(interview.get("repository_id"))
    index = len(interview["answers"])
    if index >= len(questions):
        raise HTTPException(409, "No more questions")
    return questions[index]


@router.post("/{interview_id}/answer")
def answer(interview_id: str, payload: AnswerRequest):
    interview = store.get_interview(interview_id)
    if not interview:
        raise HTTPException(404, "Interview not found")
    questions = _questions(interview.get("repository_id"))
    question = next((item for item in questions if item["id"] == payload.question_id), questions[0])
    result = _evaluate(question, payload.answer)
    record = {"question_id": payload.question_id, "answer": payload.answer,
              "question": question["text"], "evidence": question["evidence"], **result}
    interview["answers"].append(record)
    interview["status"] = "in_progress"
    store.save_interview(interview)
    store.save_answer({"interview_id": interview_id, **record})
    return result


@router.post("/{interview_id}/complete")
def complete(interview_id: str):
    interview = store.get_interview(interview_id)
    if not interview:
        raise HTTPException(404, "Interview not found")
    interview["status"] = "completed"
    store.save_interview(interview)
    return {"id": interview_id, "status": "completed"}


@router.get("/{interview_id}/report")
def report(interview_id: str):
    interview = store.get_interview(interview_id)
    if not interview:
        raise HTTPException(404, "Interview not found")
    scores = [answer["scores"] for answer in interview["answers"]]
    average = {}
    keys = ("correctness", "relevance", "completeness", "structure", "examples")
    for key in keys:
        average[key] = round(sum(item[key] for item in scores) / len(scores)) if scores else 0
    weights = {"correctness": 30, "relevance": 20, "completeness": 20, "structure": 15, "examples": 15}
    overall = round(sum(average[key] * weights[key] for key in keys) / 100)
    return {"id": interview_id, "status": interview["status"], "overall": overall,
            "scores": average, "answers": interview["answers"]}
