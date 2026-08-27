'use client';
import Link from 'next/link';

export default function LearningPaths({ paths }) {
  const pathNames = Object.keys(paths);
  const sorted = pathNames
    .map(name => {
      const p = paths[name];
      const total = (p.beginner?.length || 0) + (p.intermediate?.length || 0) + (p.advanced?.length || 0);
      return { name, total, levels: p };
    })
    .sort((a, b) => b.total - a.total);

  return (
    <section className="section" id="paths">
      <div className="section-inner">
        <header className="section-header">
          <span className="section-eyebrow">Curriculum</span>
          <h2 className="section-title">学习路径</h2>
          <div className="section-rule" />
        </header>

        <div className="paths-list">
          {sorted.map((p, i) => (
            <Link key={p.name} href={`/path/${encodeURIComponent(p.name)}`} className="path-row">
              <span className="path-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="path-body">
                <div className="path-title">{p.name}</div>
                <div className="path-meta">
                  入门 {p.levels.beginner?.length || 0}
                  <span className="path-meta-dot" />
                  进阶 {p.levels.intermediate?.length || 0}
                  <span className="path-meta-dot" />
                  高级 {p.levels.advanced?.length || 0}
                </div>
              </div>
              <svg className="path-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link
            href="/path"
            style={{
              fontSize: 13,
              letterSpacing: '0.08em',
              color: 'var(--gold, #a68848)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--gold, #a68848)',
              paddingBottom: 2,
              transition: 'opacity 0.2s',
            }}
          >
            查看全部路径 →
          </Link>
        </div>
      </div>
    </section>
  );
}
