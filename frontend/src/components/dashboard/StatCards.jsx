export default function StatCards({ history }) {
  const avg = Math.round(history.reduce((s, h) => s + h.score, 0) / history.length);
  const stats = [
    { label: 'Interviews taken', value: history.length },
    { label: 'Average score', value: `${avg}%` },
    { label: 'Weakest topic', value: 'DSA', note: '55%' },
  ];
  return (
    <div className="stats">
      {stats.map((s) => (
        <div className="card stat" key={s.label}>
          <small className="muted">{s.label}</small>
          <b>{s.value}</b>{s.note && <span className="muted small">{s.note}</span>}
        </div>
      ))}
    </div>
  );
}
