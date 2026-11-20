# Interview Mirror

AI-powered technical interview and project-defense platform. Monorepo: `frontend/` (React + Vite), `backend/` (FastAPI), `infrastructure/`, `docs/`.

## Run the frontend (works on its own with demo data)

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Log in with any email and password. The UI uses demo data and a simple demo scorer (`src/services/mockData.js`, `src/services/api.js`).
Set `VITE_USE_MOCK=false` in `frontend/.env` once the backend endpoints exist.

## Run the backend skeleton

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload                        # http://localhost:8000/docs
```

All routes from the API design exist and return 501 until implemented. `intelligence/parsers/python_parser.py` is a working starting point.

## Everything with Docker

```bash
cp .env.example .env
docker compose -f infrastructure/docker-compose.yml up --build
```

## What is real vs. placeholder

Real: UI, routing, interview flow, timer, browser speech input, score ring/breakdown, weighted scoring formula, Python AST extractor.
Placeholder: auth, GitHub OAuth, resume parsing, RAG, LLM question generation, evaluation, Whisper, database persistence. Answer scores in the demo are keyword heuristics.
