'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import UnkadMark from './UnkadMark';

const links = [
  { href: '/research', label: 'Research' },
  { href: '/platform', label: 'Qor' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // The `js` class gates JS-only UI (the mobile menu button) in CSS, so the
  // exported HTML degrades gracefully when JavaScript is disabled.
  useEffect(() => {
    document.documentElement.classList.add('js');
  }, []);

  // Close the mobile menu when navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape and hand focus back to the toggle, so a keyboard user
  // whose focus was inside the (now hidden) list doesn't fall to <body>.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  function isCurrent(href: string) {
    return pathname === href || (href !== '/' && pathname.startsWith(href + '/'));
  }

  return (
    <header className="site-header">
      <div className="container">
        <Link className="wordmark" href="/">
          <UnkadMark size={16} />
          Unkad Labs
        </Link>
        <nav aria-label="Main">
          <button
            ref={toggleRef}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
          <ul id="site-nav" className={open ? 'nav-list is-open' : 'nav-list'}>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
