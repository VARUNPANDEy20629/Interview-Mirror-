import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try { await login(email, password); navigate('/'); } catch { setError('Could not sign in. Check your email and password.'); }
  };

  return (
    <div className="auth">
      <form className="card auth-card" onSubmit={submit}>
        <div className="brand dark">Mirror</div>
        <h1>Welcome back</h1>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="pw">Password</label>
        <input id="pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn" type="submit">Log in</button>
        <p className="small muted">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </div>
  );
}
