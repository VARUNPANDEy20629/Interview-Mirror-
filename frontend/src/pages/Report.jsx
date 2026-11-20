import Topbar from '../components/common/Topbar.jsx';
import ScoreRing from '../components/analytics/ScoreRing.jsx';
import ScoreBreakdown from '../components/analytics/ScoreBreakdown.jsx';
import AIInsights from '../components/dashboard/AIInsights.jsx';
import { insights } from '../services/mockData.js';
import { averageScores, formatTime } from '../utils/scoring.js';

function load() {
  try { return JSON.parse(sessionStorage.getItem('im_last')); } catch { return null; }
}

export default function Report() {
  const last = load();
  const list = last?.list ?? [];
  const avg = averageScores(list);
  const overall = list.length ? Math.round(list.reduce((s, d) => s + d.final, 0) / list.length) : 78;

  return (
    <>
      <Topbar back title="Interview report" />
      <div className="cols">
        <div className="stack">
          <div className="pair">
            <section className="card center"><h2 className="card-title">Overall score</h2><ScoreRing value={overall} />
              {last && <p className="muted small">Duration {formatTime(last.seconds)}</p>}</section>
            <section className="card"><h2 className="pill-title">Score breakdown</h2>
              <ScoreBreakdown scores={avg ?? { correctness: 82, relevance: 80, completeness: 72, structure: 76, examples: 70 }} /></section>
          </div>
          <section className="card consistency">
            <h2 className="card-title">Explanation vs. code <span className="pill warn">Demo example</span></h2>
            <p>Claim: "My project uses binary search to find student records."</p>
            <p className="muted small">student_manager.py lines 14-16 loop through every record, so the implementation is a linear search. In the live system this check comes from AST pattern detection, not from the language model.</p>
          </section>
          {list.length === 0 && <section className="card"><p className="muted">No completed interview in this session yet. Finish one from the Interviews page to see per-question feedback here.</p></section>}
          {list.map((d) => (
            <section className="card" key={d.question.id}>
              <div className="split-head"><h3>{d.question.category}</h3><span className="pill good">{d.final}%</span></div>
              <p>{d.question.text}</p>
              <p className="muted small mono">{d.question.evidence.file} · line {d.question.evidence.startLine}</p>
              <blockquote>{d.answer}</blockquote>
              <ul>{d.feedback.map((f) => <li key={f}>{f}</li>)}</ul>
            </section>
          ))}
        </div>
        <div className="stack"><AIInsights items={insights} /></div>
      </div>
    </>
  );
}
