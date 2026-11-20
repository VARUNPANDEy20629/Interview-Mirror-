import { weights } from '../services/mockData.js';

// Final Score = sum(criterion score x criterion weight)
export function finalScore(scores) {
  const total = weights.reduce((sum, w) => sum + (scores[w.key] ?? 0) * (w.weight / 100), 0);
  return Math.round(total);
}

export function averageScores(list) {
  if (!list.length) return null;
  const avg = {};
  weights.forEach((w) => { avg[w.key] = Math.round(list.reduce((s, r) => s + r.scores[w.key], 0) / list.length); });
  return avg;
}

export function scoreLabel(v) {
  if (v >= 85) return 'Excellent - interview ready';
  if (v >= 70) return 'Good - mostly ready, a few areas to improve';
  if (v >= 50) return 'Fair - focus on the weak topics below';
  return 'Needs work - start with the practice plan';
}

export const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
