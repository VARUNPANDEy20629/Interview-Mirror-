from fastapi import APIRouter

from app.core.store import store

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/dashboard")
def dashboard():
    answers = store.list_answers()
    completed = [item for item in answers if item.get("scores")]
    history = []
    for interview_id in dict.fromkeys(item["interview_id"] for item in completed):
        interview = store.get_interview(interview_id)
        if interview:
            records = [item for item in completed if item["interview_id"] == interview_id]
            scores = [sum(item["scores"].values()) / 5 for item in records]
            history.append({"id": interview_id, "score": round(sum(scores) / len(scores)),
                            "repo": interview.get("repository_id") or "General", "type": interview["type"]})
    return {"history": history, "topics": [], "insights": [],
            "repositories": len(store.list_repositories()), "interviews": len(store.data["interviews"])}


@router.get("/progress")
def progress():
    return {"answers": len(store.list_answers()), "history": store.list_answers()}


@router.get("/weak-topics")
def weak_topics():
    weak = []
    for answer in store.list_answers():
        scores = answer.get("scores", {})
        for topic, score in scores.items():
            if score < 70:
                weak.append({"topic": topic, "score": score})
    return {"topics": weak}
