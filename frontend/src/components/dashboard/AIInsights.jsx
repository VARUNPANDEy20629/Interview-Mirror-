import Icon from '../common/Icon.jsx';

const kinds = { strength: ['check', 'good'], improve: ['alert', 'warn'], action: ['target', 'bad'] };

export default function AIInsights({ items }) {
  return (
    <section className="card">
      <h2 className="card-title"><span className="spark">✦</span> AI Insights</h2>
      <ul className="insights">
        {items.map((it) => (
          <li key={it.title}>
            <span className={`ins-icon ${kinds[it.kind][1]}`}><Icon name={kinds[it.kind][0]} size={16} /></span>
            <div><b>{it.title}</b><p>{it.text}</p></div>
          </li>
        ))}
      </ul>
    </section>
  );
}
