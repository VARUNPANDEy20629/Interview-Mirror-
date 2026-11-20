import { useCallback, useRef, useState } from 'react';

// Browser speech-to-text for the demo. The full system sends recorded audio
// to POST /speech/transcribe (Whisper) for accurate transcripts and metrics.
export default function useSpeech(onText) {
  const [listening, setListening] = useState(false);
  const rec = useRef(null);
  const supported = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

  const toggle = useCallback(() => {
    if (!supported) return;
    if (listening) { rec.current?.stop(); setListening(false); return; }
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new R();
    r.continuous = true;
    r.interimResults = false;
    r.onresult = (e) => {
      const last = e.results[e.results.length - 1];
      if (last.isFinal) onText(last[0].transcript.trim());
    };
    r.onend = () => setListening(false);
    r.start();
    rec.current = r;
    setListening(true);
  }, [listening, onText, supported]);

  return { listening, toggle, supported: !!supported };
}
