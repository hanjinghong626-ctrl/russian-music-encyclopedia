'use client';
import Link from 'next/link';

const views = [
  {
    label: 'Cards',
    title: '卡片视图',
    desc: '以图卡方式浏览词条，适合随兴翻阅',
    href: '/browse?view=card',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="4" y="4" width="11" height="14" rx="1" />
        <rect x="17" y="4" width="11" height="14" rx="1" />
        <rect x="4" y="20" width="11" height="8" rx="1" />
        <rect x="17" y="20" width="11" height="8" rx="1" />
      </svg>
    ),
  },
  {
    label: 'Table',
    title: '术语表格',
    desc: '紧凑的对照表，中俄术语并排呈现',
    href: '/browse?view=table',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1">
        <rect x="4" y="5" width="24" height="22" rx="1" />
        <line x1="4" y1="12" x2="28" y2="12" />
        <line x1="14" y1="5" x2="14" y2="27" />
        <line x1="4" y1="19" x2="28" y2="19" />
      </svg>
    ),
  },
  {
    label: 'List',
    title: '列表视图',
    desc: '按字母顺序排列，快速定位术语',
    href: '/browse?view=list',
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1">
        <line x1="8" y1="9" x2="26" y2="9" strokeLinecap="round" />
        <line x1="8" y1="16" x2="26" y2="16" strokeLinecap="round" />
        <line x1="8" y1="23" x2="22" y2="23" strokeLinecap="round" />
        <circle cx="5" cy="9" r="1" fill="currentColor" />
        <circle cx="5" cy="16" r="1" fill="currentColor" />
        <circle cx="5" cy="23" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

export default function ViewsSection() {
  return (
    <section className="section section-warm" id="views">
      <div className="section-inner">
        <header className="section-header">
          <span className="section-eyebrow">Browse</span>
          <h2 className="section-title">三种阅读方式</h2>
          <div className="section-rule" />
        </header>
        <div className="views-grid">
          {views.map(v => (
            <Link key={v.label} href={v.href} className="view-card">
              <div className="view-icon-wrap">{v.icon}</div>
              <div className="view-card-label">{v.label}</div>
              <div className="view-card-title">{v.title}</div>
              <p className="view-card-desc">{v.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
