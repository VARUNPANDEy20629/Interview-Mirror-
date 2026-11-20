import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Icon from './Icon.jsx';

export default function Topbar({ title, back }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <header className="topbar">
      {back && <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Go back"><Icon name="back" /></button>}
      <h1>{title}</h1>
      <div className="topbar-right">
        <button className="bell" aria-label="Notifications"><Icon name="bell" /><i /></button>
        <div className="user-pill"><span>{user?.name}</span><b className="avatar">{user?.name?.[0]}</b></div>
      </div>
    </header>
  );
}
