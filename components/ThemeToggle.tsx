'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

function currentTheme(): Theme {
  const explicit = document.documentElement.getAttribute('data-theme');
  if (explicit === 'dark' || explicit === 'light') return explicit;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeToggle() {
  // null until mounted; the server render shows a neutral label,
  // then the real theme is read on the client.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(currentTheme());
  }, []);

  function toggle() {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode or storage disabled; theme still applies this visit */
    }
    setTheme(next);
  }

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle color theme">
      {theme === null ? 'Theme' : theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  );
}
