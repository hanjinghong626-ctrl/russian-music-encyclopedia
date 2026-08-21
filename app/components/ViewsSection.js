'use client';

import Link from 'next/link';

const views = [
  { id: 'card', label: 'Card View', zh: '百科卡片',
    desc: '沉浸式卡片浏览，每个词条的完整释义与交叉引用一目了然。',
    icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="6" width="28" height="24" rx="2" stroke="currentColor" strokeWidth="1.2"/><line x1="4" y1="13" x2="32" y2="13" stroke="currentColor" strokeWidth="1.2"/><line x1="10" y1="18" x2="26" y2="18" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/><line x1="10" y1="22" x2="22" y2="22" stroke="currentColor" strokeWidth="0.8" opacity="0.5"/></svg> },
  { id: 'table', label: 'Table View', zh: '术语表格',
    desc: '中俄对照速查表，快速定位术语，适合系统学习与复习。',
    icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="6" width="28" height="24" rx="2" stroke="currentColor" strokeWidth="1.2"/><line x1="4" y1="13" x2="32" y2="13" stroke="currentColor" strokeWidth="1.2"/><line x1="16" y1="6" x2="16" y2="30" stroke="currentColor" strokeWidth="1.2"/></svg> },
  { id: 'list', label: 'List View', zh: '词条列表',
    desc: '紧凑列表模式，高效扫读全部词条，点击展开详情。',
    icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><line x1="8" y1="10" x2="28" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="8" y1="18" x2="28" y2="18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><line x1="8" y1="26" x2="22" y2="26" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="5" cy="10" r="1.5" fill="currentColor"/><circle cx="5" cy="18" r="1.5" fill="currentColor"/><circle cx="5" cy="26" r="1.5" fill="currentColor"/></svg> },
];

export default function ViewsSection() {
  return (
    <section className="section section--dark">
      <div className="container">
        <div className="section-header section-header--light">
          <span className="section-eyebrow">Three Perspectives</span>
          <h2 className="section-title">三种浏览方式</h2>
          <div className="section-ornament"><span /><span className="ornament-leaf">❦</span><span /></div>
        </div>
        <div className="views-grid">
          {views.map((v) => (
            <Link key={v.id} href={`/browse?view=${v.id}`} className="view-card">
              <div className="view-card-icon">{v.icon}</div>
              <h3 className="view-card-title">{v.zh}</h3>
              <p className="view-card-label">{v.label}</p>
              <p className="view-card-desc">{v.desc}</p>
              <span className="view-card-cta">Enter
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{marginLeft:6}}>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
