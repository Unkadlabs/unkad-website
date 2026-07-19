'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import UnkadMark from './UnkadMark';

const links = [
  { href: '/research', label: 'Research' },
  { href: '/platform', label: 'Platform' },
  { href: '/about', label: 'About' },
  { href: '/articles', label: 'Articles' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The `js` class gates JS-only UI (Menu button, theme toggle) in CSS,
  // so the exported HTML degrades gracefully when JavaScript is disabled.
  useEffect(() => {
    document.documentElement.classList.add('js');
  }, []);

  // Close the mobile menu when navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isCurrent(href: string) {
    return pathname === href || (href !== '/' && pathname.startsWith(href + '/'));
  }

  return (
    <header className="site-header">
      <div className="container">
        <Link className="wordmark" href="/">
          <UnkadMark size={15} />
          Unkad
        </Link>
        <nav aria-label="Main">
          <button
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen(!open)}
          >
            Menu
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
        <ThemeToggle />
      </div>
    </header>
  );
}
