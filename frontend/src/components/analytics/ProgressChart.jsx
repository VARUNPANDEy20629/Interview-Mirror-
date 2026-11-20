export default function ProgressChart({ data }) {
  const w = 520, h = 200, pad = 28;
  const pts = data.map((d, i) => [pad + (i * (w - pad * 2)) / Math.max(1, data.length - 1), h - pad - ((d.score - 40) / 60) * (h - pad * 2)]);
  const line = pts.map((p) => p.join(',')).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart" role="img" aria-label="Interview score over time">
      {[40, 60, 80, 100].map((g) => {
        const y = h - pad - ((g - 40) / 60) * (h - pad * 2);
        return <g key={g}><line x1={pad} x2={w - pad} y1={y} y2={y} stroke="#eadede" /><text x="2" y={y + 4} fontSize="10" fill="#8a7f7f">{g}</text></g>;
      })}
      <polyline points={line} fill="none" stroke="#2f6bf0" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}><circle cx={p[0]} cy={p[1]} r="5" fill="#fff" stroke="#2f6bf0" strokeWidth="3" />
          <text x={p[0]} y={h - 6} fontSize="10" textAnchor="middle" fill="#8a7f7f">{data[i].date}</text></g>
      ))}
    </svg>
  );
}
