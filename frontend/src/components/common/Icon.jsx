const paths = {
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>,
  repo: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  interview: <path d="M3 4h18M5 4v10h14V4M12 14v6M8 20h8" />,
  analysis: <path d="M6 20v-8M12 20V5M18 20v-5" />,
  insights: <path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z" />,
  practice: <path d="M7 4l13 8-13 8z" />,
  logout: <path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M16 8l4 4-4 4M20 12H9" />,
  bell: <path d="M6 9a6 6 0 0 1 12 0c0 6 3 7 3 7H3s3-1 3-7M10 20a2 2 0 0 0 4 0" />,
  back: <path d="M15 5l-7 7 7 7" />,
  mic: <path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3" />,
  cam: <path d="M3 7h12v10H3zM15 11l6-3v8l-6-3z" />,
  end: <path d="M3 14c5-5 13-5 18 0l-2 3-3.5-1.2V13a9 9 0 0 0-7 0v2.8L5 17z" />,
  check: <path d="M5 12l4 4 10-10" />,
  alert: <path d="M12 4l9 16H3zM12 10v4M12 17v.5" />,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /></>,
};

export default function Icon({ name, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
