import * as mock from './mockData.js';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const BASE = '/api/v1';
const wait = (v, ms = 250) => new Promise((r) => setTimeout(() => r(v), ms));

async function request(path, options = {}) {
  const res = await fetch(BASE + path, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

// Demo scoring only: a simple keyword/length heuristic so the UI is interactive.
// The real engine is POST /interviews/{id}/answer (rubric + RAG evidence).
function demoEvaluate(question, answer) {
  const text = answer.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean).length;
  const hits = question.keywords.filter((k) => text.includes(k)).length;
  const coverage = Math.min(1, hits / 4);
  const length = Math.min(1, words / 60);
  const clamp = (n) => Math.max(20, Math.min(98, Math.round(n)));
  const scores = {
    correctness: clamp(30 + coverage * 65),
    relevance: clamp(35 + coverage * 60),
    completeness: clamp(25 + length * 40 + coverage * 30),
    structure: clamp(30 + length * 55),
    examples: clamp(20 + (/(for example|e\.g\.|such as|suppose)/.test(text) ? 50 : 10) + coverage * 20),
  };
  const feedback = [];
  if (hits < 3) feedback.push('Mention more of the key concepts this part of the code relies on.');
  if (words < 40) feedback.push('Give a fuller explanation, including why you chose this approach.');
  if (!/(for example|e\.g\.|such as|suppose)/.test(text)) feedback.push('Add a concrete example or input to illustrate your point.');
  if (!feedback.length) feedback.push('Good answer. Next, discuss trade-offs or alternatives.');
  return { scores, feedback };
}

export const api = {
  async login(email) {
    if (USE_MOCK) return wait({ ...mock.demoUser, email });
    return request('/auth/login', { method: 'POST', body: JSON.stringify({ email }) });
  },
  async register(name, email) {
    if (USE_MOCK) return wait({ name, email });
    return request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email }) });
  },
  async repositories() { return USE_MOCK ? wait(mock.repos) : request('/github/repositories'); },
  async analyzeRepository(id) {
    if (USE_MOCK) return wait({ id, status: 'completed', files: 24, classes: 5, functions: 19 }, 1200);
    return request('/repositories/analyze', { method: 'POST', body: JSON.stringify({ repository_id: id }) });
  },
  async questions() { return USE_MOCK ? wait(mock.questions) : request('/interviews/next-question'); },
  async evaluate(question, answer) {
    return USE_MOCK ? wait(demoEvaluate(question, answer), 500) : request('/interviews/answer', { method: 'POST', body: JSON.stringify({ question_id: question.id, answer }) });
  },
  async dashboard() { return USE_MOCK ? wait({ history: mock.history, topics: mock.topics, insights: mock.insights }) : request('/analytics/dashboard'); },
};
