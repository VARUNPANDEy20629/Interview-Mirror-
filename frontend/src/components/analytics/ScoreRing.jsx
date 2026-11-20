import { scoreLabel } from '../../utils/scoring.js';

export default function ScoreRing({ value = 0, size = 168, caption = true }) {
  const r = 64;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring-wrap">
      <svg viewBox="0 0 160 160" width={size} height={size} role="img" aria-label={`Score ${value} percent`}>
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#3b6cf0" />
          </linearGradient>
        </defs>
        <circle cx="80" cy="80" r={r} fill="none" stroke="#e6ecfa" strokeWidth="9" />
        <circle cx="80" cy="80" r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={`${(c * value) / 100} ${c}`} transform="rotate(-90 80 80)" style={{ transition: 'stroke-dasharray .6s ease' }} />
        <text x="80" y="91" textAnchor="middle" className="ring-text">{value}%</text>
      </svg>
      {caption && <p className="muted small">{scoreLabel(value)}</p>}
    </div>
  );
}
