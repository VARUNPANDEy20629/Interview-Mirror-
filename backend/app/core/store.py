import json
import secrets
import threading
from pathlib import Path
from typing import Any

from app.config import settings


class Store:
    def __init__(self) -> None:
        self.path = Path(settings.data_dir)
        self.path.mkdir(parents=True, exist_ok=True)
        self.file = self.path / "interview_mirror.json"
        self.lock = threading.RLock()
        self.data: dict[str, Any] = {
            "users": {},
            "repositories": {},
            "interviews": {},
            "resumes": {},
            "answers": [],
        }
        self._load()

    def _load(self) -> None:
        if self.file.exists():
            try:
                self.data.update(json.loads(self.file.read_text(encoding="utf-8")))
            except (json.JSONDecodeError, OSError):
                pass

    def _save(self) -> None:
        self.file.write_text(json.dumps(self.data, indent=2), encoding="utf-8")

    def create_id(self, prefix: str) -> str:
        return f"{prefix}_{secrets.token_hex(8)}"

    def get_user_by_email(self, email: str) -> dict[str, Any] | None:
        with self.lock:
            return self.data["users"].get(email.lower())

    def save_user(self, user: dict[str, Any]) -> dict[str, Any]:
        with self.lock:
            self.data["users"][user["email"].lower()] = user
            self._save()
        return user

    def save_repository(self, repository: dict[str, Any]) -> dict[str, Any]:
        with self.lock:
            self.data["repositories"][repository["id"]] = repository
            self._save()
        return repository

    def get_repository(self, repository_id: str) -> dict[str, Any] | None:
        with self.lock:
            return self.data["repositories"].get(repository_id)

    def list_repositories(self) -> list[dict[str, Any]]:
        with self.lock:
            return list(self.data["repositories"].values())

    def save_interview(self, interview: dict[str, Any]) -> dict[str, Any]:
        with self.lock:
            self.data["interviews"][interview["id"]] = interview
            self._save()
        return interview

    def get_interview(self, interview_id: str) -> dict[str, Any] | None:
        with self.lock:
            return self.data["interviews"].get(interview_id)

    def save_answer(self, answer: dict[str, Any]) -> None:
        with self.lock:
            self.data["answers"].append(answer)
            self._save()

    def list_answers(self) -> list[dict[str, Any]]:
        with self.lock:
            return list(self.data["answers"])

    def save_resume(self, resume: dict[str, Any]) -> dict[str, Any]:
        with self.lock:
            self.data["resumes"][resume["id"]] = resume
            self._save()
        return resume

    def get_resume(self, resume_id: str) -> dict[str, Any] | None:
        with self.lock:
            return self.data["resumes"].get(resume_id)


store = Store()
