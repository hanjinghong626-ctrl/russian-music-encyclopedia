'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''}`}>
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="nav-logo-icon">
            <path d="M14 3C14 3 11 3 9.5 5.5C8 8 9.5 11 12 11.5C11 9.5 12 7 14 6.5C16 6 18 7.5 18 10C18 14 14 18 14 18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <circle cx="11" cy="20" r="3.5" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="18" cy="18" r="2.8" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M14.5 16.5L18 15.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span className="nav-logo-text">Энциклопедия</span>
        </Link>
        <div className="nav-links">
          <Link href="/browse" className="nav-link">Browse</Link>
          <Link href="/#categories" className="nav-link">Categories</Link>
          <Link href="/#paths" className="nav-link">Paths</Link>
          <Link href="/browse" className="nav-link nav-link--cta">Search</Link>
        </div>
      </div>
    </nav>
  );
}
