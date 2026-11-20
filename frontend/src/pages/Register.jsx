import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { setError('Use at least 8 characters for your password.'); return; }
    try { await register(form.name, form.email, form.password); navigate('/'); } catch { setError('Could not create the account. Try a different email.'); }
  };

  return (
    <div className="auth">
      <form className="card auth-card" onSubmit={submit}>
        <div className="brand dark">Mirror</div>
        <h1>Create your account</h1>
        <label htmlFor="name">Name</label>
        <input id="name" required value={form.name} onChange={set('name')} />
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={form.email} onChange={set('email')} />
        <label htmlFor="pw">Password</label>
        <input id="pw" type="password" required value={form.password} onChange={set('password')} />
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn" type="submit">Create account</button>
        <p className="small muted">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  );
}
