'use client';

// The live corpus record, fed by the platform's public stats API and
// rendered as a data ledger: one measured line, one scale, a dated note.
// Renders nothing until data arrives (and nothing at all if the fetch
// fails), so the static page stays clean without it.

import { useEffect, useState } from 'react';

type Stats = {
  accepted: number;
  pending: number;
  contributors: number;
  goal: number;
};

export default function LiveStats({ version }: { version?: string }) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('https://qor.unkad.com/api/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setStats(d))
      .catch(() => {});
  }, []);

  if (!stats) return null;

  const pct = Math.min(100, (stats.accepted / stats.goal) * 100);
  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div>
      <p className="ledger-line">
        <span className="tnum">{stats.accepted.toLocaleString()}</span> validated sentences ·{' '}
        <span className="tnum">{stats.contributors.toLocaleString()}</span> contributors ·{' '}
        <span className="tnum">{stats.pending.toLocaleString()}</span> awaiting validation
        {version ? <> · current release {version}</> : null} · live from qor.unkad.com,{' '}
        {today}
      </p>
      <div className="ledger-scale">
        <div
          className="ledger-scale-track"
          role="progressbar"
          aria-valuenow={stats.accepted}
          aria-valuemin={0}
          aria-valuemax={stats.goal}
          aria-label="Progress toward 100,000 validated sentences"
        >
          <div className="ledger-scale-fill" style={{ width: `${Math.max(0.5, pct)}%` }} />
        </div>
        <div className="ledger-scale-caption">
          <span>0</span>
          <span>goal: {stats.goal.toLocaleString()} validated sentences</span>
        </div>
      </div>
    </div>
  );
}
