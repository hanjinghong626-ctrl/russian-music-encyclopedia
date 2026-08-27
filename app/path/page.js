'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../home.css';

export default function PathIndexPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/data/encyclopedia_unified.json')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="page-loading">
        <div className="page-loading-spinner" />
        <p>Загрузка…</p>
      </div>
    );
  }

  const { learning_paths, category_groups, entries } = data;

  // Build entry map for quick lookup
  const entryMap = new Map();
  for (const e of entries) entryMap.set(String(e.id), e);

  // Group paths by category_groups
  const groups = category_groups.map(g => {
    const paths = g.categories
      .filter(catName => learning_paths[catName])
      .map(catName => {
        const lp = learning_paths[catName];
        const bCount = lp.beginner?.length || 0;
        const iCount = lp.intermediate?.length || 0;
        const aCount = lp.advanced?.length || 0;
        const total = bCount + iCount + aCount;
        return { name: catName, total, beginner: bCount, intermediate: iCount, advanced: aCount };
      });
    return {
      group: g.group,
      icon: g.icon || '',
      totalEntries: g.total_entries,
      paths,
    };
  }).filter(g => g.paths.length > 0);

  // Calculate global stats
  const allPathNames = Object.keys(learning_paths);
  const totalPaths = allPathNames.length;
  const totalPathEntries = allPathNames.reduce((sum, name) => {
    const lp = learning_paths[name];
    return sum + (lp.beginner?.length || 0) + (lp.intermediate?.length || 0) + (lp.advanced?.length || 0);
  }, 0);

  return (
    <>
      <Navbar />
      <main className="pi-page">
        {/* Header */}
        <div className="pi-header">
          <span className="pi-eyebrow">Curriculum</span>
          <h1 className="pi-title">学习路径</h1>
          <p className="pi-cyr">Учебные пути</p>
          <div className="pi-rule" />
          <p className="pi-desc">
            系统化的音乐术语学习路线。每条路径按入门、进阶、高级三个阶段编排，
            从基础概念到专业术语循序渐进。
          </p>
          <div className="pi-stats">
            <div className="pi-stat">
              <span className="pi-stat-num">{totalPaths}</span>
              <span className="pi-stat-label">学习路径</span>
            </div>
            <div className="pi-stat">
              <span className="pi-stat-num">{totalPathEntries}</span>
              <span className="pi-stat-label">词条总量</span>
            </div>
            <div className="pi-stat">
              <span className="pi-stat-num">{groups.length}</span>
              <span className="pi-stat-label">知识领域</span>
            </div>
          </div>
        </div>

        {/* Groups */}
        {groups.map((g, gi) => (
          <section key={g.group} className="pi-group">
            <div className="pi-group-header">
              <span className="pi-group-icon">{g.icon}</span>
              <div>
                <h2 className="pi-group-title">{g.group}</h2>
                <p className="pi-group-meta">
                  {g.paths.length} 条路径 · {g.paths.reduce((s, p) => s + p.total, 0)} 个词条
                </p>
              </div>
            </div>
            <div className="pi-group-paths">
              {g.paths.map((p, pi) => (
                <Link
                  key={p.name}
                  href={`/path/${encodeURIComponent(p.name)}`}
                  className="pi-path-card"
                >
                  <div className="pi-path-top">
                    <span className="pi-path-num">{String(pi + 1).padStart(2, '0')}</span>
                    <span className="pi-path-name">{p.name}</span>
                  </div>
                  <div className="pi-path-bars">
                    <div className="pi-path-bar-group">
                      <div className="pi-path-bar" style={{ '--bar-pct': `${p.total > 0 ? (p.beginner / p.total * 100) : 0}%`, '--bar-color': '#6b9080' }}>
                        <div className="pi-path-bar-fill" />
                      </div>
                      <span className="pi-path-bar-label">入门 {p.beginner}</span>
                    </div>
                    <div className="pi-path-bar-group">
                      <div className="pi-path-bar" style={{ '--bar-pct': `${p.total > 0 ? (p.intermediate / p.total * 100) : 0}%`, '--bar-color': '#a68848' }}>
                        <div className="pi-path-bar-fill" />
                      </div>
                      <span className="pi-path-bar-label">进阶 {p.intermediate}</span>
                    </div>
                    <div className="pi-path-bar-group">
                      <div className="pi-path-bar" style={{ '--bar-pct': `${p.total > 0 ? (p.advanced / p.total * 100) : 0}%`, '--bar-color': '#8b5e3c' }}>
                        <div className="pi-path-bar-fill" />
                      </div>
                      <span className="pi-path-bar-label">高级 {p.advanced}</span>
                    </div>
                  </div>
                  <span className="pi-path-total">{p.total} 词条</span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
