'use client';

import Link from 'next/link';

export default function LearningPaths({ paths, entries }) {
  const pathList = Object.entries(paths).map(([name, levels]) => {
    const b = (levels.beginner || []).length;
    const i = (levels.intermediate || []).length;
    const a = (levels.advanced || []).length;
    return { name, total: b+i+a, b, i, a };
  }).filter(p => p.total > 0).sort((x, y) => y.total - x.total).slice(0, 6);

  return (
    <section id="paths" className="section section--light">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Learning Paths</span>
          <h2 className="section-title">学习路径</h2>
          <div className="section-ornament"><span /><span className="ornament-leaf">❦</span><span /></div>
          <p className="section-subtitle">从入门到精通，按主题系统化阅读</p>
        </div>
        <div className="paths-grid">
          {pathList.map((p) => (
            <Link key={p.name} href={`/path/${encodeURIComponent(p.name)}`} className="path-card">
              <div className="path-card-accent" />
              <h3 className="path-card-title">{p.name}</h3>
              <div className="path-card-meta">
                <span>{p.total} 词条</span><span className="path-meta-dot">·</span>
                <span>初 {p.b}</span><span className="path-meta-dot">·</span>
                <span>中 {p.i}</span><span className="path-meta-dot">·</span>
                <span>高 {p.a}</span>
              </div>
              <p className="path-card-desc">从基础术语到进阶概念，循序渐进地掌握「{p.name}」领域的核心知识。</p>
              <span className="path-card-cta">开始学习
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
