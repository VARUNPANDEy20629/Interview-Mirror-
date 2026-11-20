import { weights } from '../../services/mockData.js';

// Segment size = rubric weight. Legend value = the candidate's score for that criterion.
export default function ScoreBreakdown({ scores }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="breakdown">
      <svg viewBox="0 0 200 200" width="170" height="170" role="img" aria-label="Score breakdown by criterion">
        {weights.map((w) => {
          const len = (c * w.weight) / 100;
          const el = (
            <circle key={w.key} cx="100" cy="100" r={r} fill="none" stroke={w.color} strokeWidth="18" strokeLinecap="round"
              strokeDasharray={`${Math.max(len - 12, 1)} ${c}`} strokeDashoffset={-(offset + 6)} transform="rotate(-90 100 100)" />
          );
          offset += len;
          return el;
        })}
      </svg>
      <ul className="legend">
        {weights.map((w) => (
          <li key={w.key}>
            <i style={{ background: w.color }} />
            <span>{w.label} <small>({w.weight}% weight)</small></span>
            <b>{scores ? `${scores[w.key]}%` : '-'}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
