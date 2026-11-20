import { useEffect, useState } from 'react';
import Topbar from '../components/common/Topbar.jsx';
import ProgressChart from '../components/analytics/ProgressChart.jsx';
import { api } from '../services/api.js';
import { learningPath } from '../services/mockData.js';

export default function Progress() {
  const [data, setData] = useState(null);
  useEffect(() => { api.dashboard().then(setData); }, []);
  if (!data) return <p className="muted">Loading...</p>;
  const series = [...data.history].reverse();

  return (
    <>
      <Topbar title="Analysis and progress" />
      <div className="cols">
        <div className="stack">
          <section className="card"><h2 className="card-title">Score over time</h2><ProgressChart data={series} /></section>
          <section className="card">
            <h2 className="card-title">Knowledge profile</h2>
            {data.topics.map((t) => (
              <div className="topic" key={t.topic}>
                <span>{t.topic}</span>
                <div className="meter"><i className={t.score < 60 ? 'low' : ''} style={{ width: `${t.score}%` }} /></div>
                <b>{t.score}%</b>
              </div>
            ))}
          </section>
        </div>
        <div className="stack">
          <section className="card">
            <h2 className="chip-title">Learning path</h2>
            <p className="muted small">Weak topic: Binary search</p>
            <ol className="path">{learningPath.map((s) => <li key={s}>{s}</li>)}</ol>
          </section>
        </div>
      </div>
    </>
  );
}
