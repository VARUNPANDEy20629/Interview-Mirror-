export default function AnswerCard({ question, answer, setAnswer, onSubmit, busy, result, onNext, last }) {
  const ev = question.evidence;
  return (
    <section className="card">
      <div className="split-head">
        <h2 className="card-title">Evidence from your code</h2>
        <span className="mono small muted">{ev.file} · lines {ev.startLine}-{ev.startLine + ev.lines.length - 1}</span>
      </div>
      <pre className="code" aria-label="Source code evidence">
        {ev.lines.map((l, n) => (
          <span key={n} className={ev.highlight.includes(n) ? 'hl' : ''}><i>{ev.startLine + n}</i>{l}</span>
        ))}
      </pre>
      <label htmlFor="answer" className="card-title" style={{ marginTop: 18 }}>Your answer</label>
      <textarea id="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} disabled={!!result}
        placeholder="Type your answer, or use the microphone button to speak it." rows={6} />
      {!result ? (
        <button className="btn" onClick={onSubmit} disabled={busy || answer.trim().length < 5}>{busy ? 'Evaluating...' : 'Submit answer'}</button>
      ) : (
        <div className="result">
          <p><b>Score: {result.final}%</b> <span className="muted small">(demo scoring)</span></p>
          <ul>{result.feedback.map((f) => <li key={f}>{f}</li>)}</ul>
          <button className="btn" onClick={onNext}>{last ? 'Finish interview' : 'Next question'}</button>
        </div>
      )}
    </section>
  );
}
