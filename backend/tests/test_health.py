from fastapi.testclient import TestClient

from app.main import app
from app.core.store import store


def test_health():
    assert TestClient(app).get("/health").json() == {"status": "ok"}


def test_register_login_and_me():
    client = TestClient(app)
    email = "test.user@example.com"
    store.data["users"].pop(email, None)
    registered = client.post("/api/v1/auth/register",
                             json={"name": "Test User", "email": email, "password": "password123"})
    assert registered.status_code == 200
    assert registered.json()["email"] == email
    assert client.get("/api/v1/auth/me").status_code == 200
    assert client.post("/api/v1/auth/logout").json()["status"] == "logged_out"


def test_repository_and_interview_flow():
    client = TestClient(app)
    analyzed = client.post("/api/v1/repositories/analyze",
                           json={"path": "backend/app", "name": "Interview Mirror Backend"})
    assert analyzed.status_code == 200
    repository_id = analyzed.json()["id"]

    interview = client.post("/api/v1/interviews/create",
                            json={"repository_id": repository_id, "type": "project-defense"})
    assert interview.status_code == 200
    interview_id = interview.json()["id"]
    assert client.post(f"/api/v1/interviews/{interview_id}/start").status_code == 200
    question = client.get(f"/api/v1/interviews/{interview_id}/next-question")
    assert question.status_code == 200

    answer = client.post(f"/api/v1/interviews/{interview_id}/answer",
                         json={"question_id": question.json()["id"],
                               "answer": "This function uses the input to calculate an output. For example, "
                                         "it receives a record and returns the matching result. The trade-off "
                                         "is that it can test and maintain its responsibilities separately."})
    assert answer.status_code == 200
    assert set(answer.json()["scores"]) == {
        "correctness", "relevance", "completeness", "structure", "examples"
    }
    report = client.get(f"/api/v1/interviews/{interview_id}/report")
    assert report.status_code == 200


def test_speech_analysis():
    client = TestClient(app)
    response = client.post("/api/v1/speech/analyze",
                           json={"transcript": "Um, I used a function. For example, it returns the result.",
                                 "duration_seconds": 30})
    assert response.status_code == 200
    assert response.json()["word_count"] > 0
