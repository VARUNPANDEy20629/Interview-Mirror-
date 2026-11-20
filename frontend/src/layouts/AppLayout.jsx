import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Icon from '../components/common/Icon.jsx';

const nav = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/repository', label: 'Repositories', icon: 'repo' },
  { to: '/interview', label: 'Interviews', icon: 'interview' },
  { to: '/progress', label: 'Analysis', icon: 'analysis' },
  { to: '/report', label: 'AI insights', icon: 'insights' },
];

export default function AppLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">Mirror</div>
        <div className="side-title">Main menu</div>
        <nav>
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <Icon name={n.icon} /><span>{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="logout" onClick={() => { logout(); navigate('/login'); }}>
          <Icon name="logout" size={22} /><span>Log out</span>
        </button>
      </aside>
      <main className="main"><Outlet /></main>
    </div>
  );
}
