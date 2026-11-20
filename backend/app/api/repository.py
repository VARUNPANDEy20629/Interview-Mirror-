from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.store import store
from app.intelligence.parsers.java_parser import parse_java
from app.intelligence.parsers.javascript_parser import parse_javascript
from app.intelligence.parsers.python_parser import parse_python

router = APIRouter(tags=["repositories"])


class AnalyzeRequest(BaseModel):
    repository_id: str | None = None
    path: str | None = None
    name: str | None = None


def analyze_project(root: Path) -> dict:
    files = []
    skip_dirs = {".git", ".venv", "node_modules", "dist", "__pycache__", "data"}
    for path in root.rglob("*"):
        if not path.is_file() or any(part in skip_dirs for part in path.parts):
            continue
        if path.suffix.lower() not in {".py", ".java", ".js", ".jsx", ".ts", ".tsx"}:
            continue
        try:
            source = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        relative = str(path.relative_to(root)).replace("\\", "/")
        if path.suffix.lower() == ".py":
            parsed = parse_python(source, relative)
        elif path.suffix.lower() == ".java":
            parsed = parse_java(source, relative)
        else:
            parsed = parse_javascript(source, relative)
        files.append(parsed)
    classes = sum(len(item["classes"]) for item in files)
    functions = sum(len(item["functions"]) for item in files)
    languages = sorted({item["language"] for item in files})
    return {"files": len(files), "classes": classes, "functions": functions,
            "languages": languages, "symbols": files, "status": "completed"}


@router.post("/repositories/analyze")
def analyze(payload: AnalyzeRequest):
    root = Path(payload.path).resolve() if payload.path else Path.cwd()
    if payload.repository_id and not payload.path:
        existing = store.get_repository(payload.repository_id)
        if existing:
            root = Path(existing.get("path", ".")).resolve()
    if not root.exists() or not root.is_dir():
        raise HTTPException(404, "Repository path not found")
    repository_id = payload.repository_id or store.create_id("repo")
    name = payload.name or root.name
    result = analyze_project(root)
    repository = {"id": repository_id, "name": name, "path": str(root), "branch": "main", **result}
    store.save_repository(repository)
    return {"id": repository_id, "status": "completed", **{k: result[k] for k in ("files", "classes", "functions", "languages")}}


@router.get("/repositories/{repo_id}")
def details(repo_id: str):
    repository = store.get_repository(repo_id)
    if not repository:
        raise HTTPException(404, "Repository not found")
    return repository


@router.get("/repositories/{repo_id}/architecture")
def architecture(repo_id: str):
    repository = store.get_repository(repo_id)
    if not repository:
        raise HTTPException(404, "Repository not found")
    imports = sorted({name for symbol in repository.get("symbols", []) for name in symbol.get("imports", [])})
    return {"repository_id": repo_id, "languages": repository.get("languages", []),
            "imports": imports, "files": repository.get("files", 0)}


@router.get("/code/{repo_id}/symbols")
def symbols(repo_id: str):
    repository = store.get_repository(repo_id)
    if not repository:
        raise HTTPException(404, "Repository not found")
    return {"repository_id": repo_id, "symbols": repository.get("symbols", [])}


@router.get("/code/{repo_id}/graph")
def graph(repo_id: str):
    repository = store.get_repository(repo_id)
    if not repository:
        raise HTTPException(404, "Repository not found")
    nodes = [{"id": symbol["file"], "type": "file", "language": symbol["language"]}
             for symbol in repository.get("symbols", [])]
    edges = []
    return {"repository_id": repo_id, "nodes": nodes, "edges": edges}
