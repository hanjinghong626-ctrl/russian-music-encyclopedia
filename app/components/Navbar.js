'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`site-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link href="/" className="nav-brand">
          <span className="nav-brand-cyr">Словарь</span>
          俄罗斯音乐辞典
        </Link>
        <div className="nav-links">
          <Link href="/browse" className="nav-link">辞典浏览</Link>
          <Link href="/#paths" className="nav-link">学习路径</Link>
          <Link href="/browse?view=table" className="nav-link">术语表</Link>
        </div>
      </div>
    </nav>
  );
}
