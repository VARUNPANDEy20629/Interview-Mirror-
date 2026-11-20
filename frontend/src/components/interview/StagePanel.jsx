import { useEffect, useRef, useState } from 'react';
import Icon from '../common/Icon.jsx';
import { formatTime } from '../../utils/scoring.js';

// Dark "interview stage": recording badge, timer, optional camera preview, question, controls.
export default function StagePanel({ question, index, total, seconds, listening, onMic, micSupported, onEnd }) {
  const video = useRef(null);
  const stream = useRef(null);
  const [camOn, setCamOn] = useState(false);

  useEffect(() => () => stream.current?.getTracks().forEach((t) => t.stop()), []);

  const toggleCam = async () => {
    if (camOn) { stream.current?.getTracks().forEach((t) => t.stop()); setCamOn(false); return; }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ video: true });
      setCamOn(true);
      requestAnimationFrame(() => { if (video.current) video.current.srcObject = stream.current; });
    } catch { /* permission denied: stay off */ }
  };

  return (
    <section className="stage">
      <div className="stage-top">
        <span className="rec"><i /> Recording</span>
        <span className="stage-meta">Question {index + 1} of {total} · {question.category} · {question.difficulty}</span>
        <div className="pip">
          {camOn ? <video ref={video} autoPlay muted playsInline /> : <span>Camera off</span>}
        </div>
      </div>
      <p className="stage-q">{question.text}</p>
      <div className="stage-bar">
        <span className="time">{formatTime(seconds)}</span>
        <div className="bar-track"><i style={{ width: `${((index) / total) * 100}%` }} /></div>
        <button className="ctl" onClick={toggleCam} aria-pressed={camOn} aria-label="Toggle camera"><Icon name="cam" /></button>
        <button className={`ctl${listening ? ' on' : ''}`} onClick={onMic} disabled={!micSupported} aria-pressed={listening}
          aria-label={micSupported ? 'Toggle voice answer' : 'Voice not supported in this browser'} title={micSupported ? '' : 'Speech recognition is not supported in this browser'}><Icon name="mic" /></button>
        <button className="ctl end" onClick={onEnd} aria-label="End interview"><Icon name="end" /></button>
      </div>
    </section>
  );
}
