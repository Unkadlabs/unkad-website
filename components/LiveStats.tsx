'use client';

// Live corpus counter, fed by the platform's public stats API.
// Renders nothing until data arrives (and nothing at all if the fetch
// fails), so the static page stays clean without it.

import { useEffect, useState } from 'react';

type Stats = { accepted: number; pending: number; contributors: number; goal: number };

export default function LiveStats({
  sentencesLabel,
  contributorsLabel,
  pendingLabel,
  goalLabel,
}: {
  sentencesLabel: string;
  contributorsLabel: string;
  pendingLabel: string;
  goalLabel: string;
}) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('https://qor.unkad.com/api/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setStats(d))
      .catch(() => {});
  }, []);

  if (!stats) return null;

  const pct = Math.min(100, (stats.accepted / stats.goal) * 100);

  return (
    <div>
      <div className="card progress-card">
        <div className="progress-head">
          <span className="eyebrow">{goalLabel}</span>
          <span
            className="tnum"
            style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', color: 'var(--muted)' }}
          >
            {stats.accepted.toLocaleString()} / {stats.goal.toLocaleString()}
          </span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={stats.accepted}
          aria-valuemin={0}
          aria-valuemax={stats.goal}
        >
          <div className="progress-fill" style={{ width: `${Math.max(0.75, pct)}%` }} />
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <span className="n">{stats.accepted.toLocaleString()}</span>
          <span className="label">{sentencesLabel}</span>
        </div>
        <div className="stat">
          <span className="n">{stats.contributors.toLocaleString()}</span>
          <span className="label">{contributorsLabel}</span>
        </div>
        <div className="stat">
          <span className="n">{stats.pending.toLocaleString()}</span>
          <span className="label">{pendingLabel}</span>
        </div>
      </div>
    </div>
  );
}
