import { useEffect, useState } from 'react';
import Topbar from '../components/common/Topbar.jsx';
import RepoCard from '../components/repository/RepoCard.jsx';
import { api } from '../services/api.js';

export default function Repository() {
  const [repos, setRepos] = useState([]);
  const [busy, setBusy] = useState(null);
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { api.repositories().then(setRepos); }, []);

  const analyze = async (id) => {
    setBusy(id);
    const result = await api.analyzeRepository(id);
    setRepos((rs) => rs.map((r) => (r.id === id ? { ...r, ...result } : r)));
    setBusy(null);
  };

  const pickResume = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { setError('Upload a PDF file.'); setResume(null); return; }
    if (f.size > 5 * 1024 * 1024) { setError('The PDF must be smaller than 5 MB.'); setResume(null); return; }
    setError(''); setResume(f.name);
  };

  return (
    <>
      <Topbar title="Repositories and resume" />
      <div className="cols">
        <div className="stack">
          {repos.map((r) => <RepoCard key={r.id} repo={r} onAnalyze={analyze} analyzing={busy === r.id} />)}
        </div>
        <div className="stack">
          <section className="card">
            <h2 className="chip-title">Resume</h2>
            <p className="muted small">Upload a PDF resume so claims can be matched to your code.</p>
            <label className="upload">
              <input type="file" accept="application/pdf" onChange={pickResume} />
              <span>{resume ?? 'Choose a PDF (max 5 MB)'}</span>
            </label>
            {error && <p className="error" role="alert">{error}</p>}
          </section>
          <section className="card">
            <h2 className="card-title">GitHub access</h2>
            <p className="muted small">Demo data is shown. Connecting GitHub uses read-only OAuth, and tokens stay on the server.</p>
            <button className="btn" disabled>Connect GitHub (backend required)</button>
          </section>
        </div>
      </div>
    </>
  );
}
