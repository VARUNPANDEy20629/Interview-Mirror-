import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Topbar from '../components/common/Topbar.jsx';
import StagePanel from '../components/interview/StagePanel.jsx';
import AnswerCard from '../components/interview/AnswerCard.jsx';
import PracticeTiles from '../components/dashboard/PracticeTiles.jsx';
import AIInsights from '../components/dashboard/AIInsights.jsx';
import ScoreRing from '../components/analytics/ScoreRing.jsx';
import ScoreBreakdown from '../components/analytics/ScoreBreakdown.jsx';
import useTimer from '../hooks/useTimer.js';
import useSpeech from '../hooks/useSpeech.js';
import { api } from '../services/api.js';
import { averageScores, finalScore } from '../utils/scoring.js';

export default function Interview() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [done, setDone] = useState([]);
  const seconds = useTimer(true);

  useEffect(() => { api.questions().then(setQuestions); }, []);
  const addText = useCallback((t) => setAnswer((a) => (a ? `${a} ${t}` : t)), []);
  const speech = useSpeech(addText);

  if (!questions.length) return <p className="muted">Loading questions...</p>;
  const q = questions[i];
  const last = i === questions.length - 1;
  const avg = averageScores(done);

  const submit = async () => {
    setBusy(true);
    const ev = await api.evaluate(q, answer);
    const entry = { question: q, answer, scores: ev.scores, feedback: ev.feedback, final: finalScore(ev.scores) };
    setDone((d) => [...d, entry]);
    setResult(entry);
    setBusy(false);
  };

  const finish = (list) => {
    sessionStorage.setItem('im_last', JSON.stringify({ list, seconds }));
    navigate('/report');
  };

  const next = () => {
    if (last) { finish(done); return; }
    setI(i + 1); setAnswer(''); setResult(null);
  };

  const insights = result
    ? [{ kind: result.final >= 70 ? 'strength' : 'improve', title: result.final >= 70 ? 'Strength insight' : 'Improvement', text: result.feedback[0] }]
    : [{ kind: 'action', title: 'Tip', text: 'Explain what the code does, why you chose it, and one alternative.' }];

  return (
    <>
      <Topbar back title={params.get('type') === 'practice' ? 'Practice: weak-topic drill' : 'Project defense: student-management'} />
      <div className="cols">
        <div className="stack">
          <StagePanel question={q} index={i} total={questions.length} seconds={seconds} listening={speech.listening}
            onMic={speech.toggle} micSupported={speech.supported} onEnd={() => finish(done)} />
          <AnswerCard question={q} answer={answer} setAnswer={setAnswer} onSubmit={submit} busy={busy} result={result} onNext={next} last={last} />
          <div className="pair">
            <section className="card center"><h2 className="card-title">Live score</h2>
              <ScoreRing value={done.length ? Math.round(done.reduce((s, d) => s + d.final, 0) / done.length) : 0} caption={false} />
              <p className="muted small">{done.length ? `Average of ${done.length} answer${done.length > 1 ? 's' : ''}` : 'Answer a question to see your score'}</p>
            </section>
            <section className="card"><h2 className="pill-title">Score breakdown</h2><ScoreBreakdown scores={avg} /></section>
          </div>
        </div>
        <div className="stack"><PracticeTiles /><AIInsights items={insights} /></div>
      </div>
    </>
  );
}
