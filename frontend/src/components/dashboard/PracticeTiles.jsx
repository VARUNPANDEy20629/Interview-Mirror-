import { Link } from 'react-router-dom';
import { practiceTiles } from '../../services/mockData.js';

export default function PracticeTiles() {
  return (
    <section className="card">
      <h2 className="chip-title">Practice recommendation</h2>
      <div className="tiles">
        {practiceTiles.map((t) => (
          <Link key={t.label} to={t.to} className="tile" aria-label={t.label}>
            <span className="tile-icon">{t.icon}</span><small>{t.label}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}
