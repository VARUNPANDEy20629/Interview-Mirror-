import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Topbar from '../components/common/Topbar.jsx';
import StatCards from '../components/dashboard/StatCards.jsx';
import PracticeTiles from '../components/dashboard/PracticeTiles.jsx';
import AIInsights from '../components/dashboard/AIInsights.jsx';
import ScoreRing from '../components/analytics/ScoreRing.jsx';
import ScoreBreakdown from '../components/analytics/ScoreBreakdown.jsx';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const lastScores = { correctness: 82, relevance: 80, completeness: 72, structure: 76, examples: 70 };

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  useEffect(() => { api.dashboard().then(setData); }, []);
  if (!data) return <p className="muted">Loading...</p>;
  const latest = data.history[0];

  return (
    <>
      <Topbar title={`Welcome back, ${user.name}`} />
      <div className="cols">
        <div className="stack">
          <section className="stage hero-stage">
            <p className="stage-meta">Next up · Project defense</p>
            <p className="stage-q">Defend student-management: your answers will be checked against the actual code.</p>
            <div className="stage-bar">
              <Link className="btn light" to="/interview">Start interview</Link>
              <Link className="btn ghost-light" to="/repository">Choose repository</Link>
            </div>
          </section>
          <StatCards history={data.history} />
          <div className="pair">
            <section className="card center"><h2 className="card-title">AI interview score</h2><ScoreRing value={latest.score} /></section>
            <section className="card"><h2 className="pill-title">Score breakdown</h2><ScoreBreakdown scores={lastScores} /></section>
          </div>
          <section className="card">
            <h2 className="card-title">Recent interviews</h2>
            <table className="table">
              <thead><tr><th>Date</th><th>Repository</th><th>Type</th><th>Score</th></tr></thead>
              <tbody>{data.history.map((h) => <tr key={h.id}><td>{h.date}</td><td>{h.repo}</td><td>{h.type}</td><td><b>{h.score}%</b></td></tr>)}</tbody>
            </table>
          </section>
        </div>
        <div className="stack"><PracticeTiles /><AIInsights items={data.insights} /></div>
      </div>
    </>
  );
}
