export default function RepoCard({ repo, onAnalyze, analyzing }) {
  const done = repo.status === 'completed';
  return (
    <article className="card repo">
      <div className="split-head">
        <h3>{repo.name}</h3>
        <span className={`pill ${done ? 'good' : 'warn'}`}>{done ? 'Analyzed' : analyzing ? 'Analyzing...' : 'Not analyzed'}</span>
      </div>
      <div className="langs">{repo.languages.map((l) => <span key={l} className="lang">{l}</span>)}</div>
      {done ? (
        <dl className="repo-stats">
          <div><dt>Files</dt><dd>{repo.files}</dd></div>
          <div><dt>Classes</dt><dd>{repo.classes}</dd></div>
          <div><dt>Functions</dt><dd>{repo.functions}</dd></div>
        </dl>
      ) : (
        <button className="btn" onClick={() => onAnalyze(repo.id)} disabled={analyzing}>Analyze repository</button>
      )}
    </article>
  );
}
