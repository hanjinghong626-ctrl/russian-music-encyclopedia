'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../home.css';

export default function PathIndexPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/encyclopedia_unified.json')
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch');
        return r.json();
      })
      .then(d => setData(d))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return (
      <>
        <Navbar />
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 20, color: '#9a9488' }}>
            数据加载失败，请刷新重试。
          </p>
        </main>
        <Footer />
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Navbar />
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
          <div style={{
            width: 32, height: 32, border: '2px solid #e0dbd3',
            borderTopColor: '#a68848', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
          }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <p style={{ fontFamily: 'var(--font-cormorant), serif', fontSize: 16, color: '#9a9488' }}>
            Загрузка…
          </p>
        </main>
        <Footer />
      </>
    );
  }

  const learningPaths = data.learning_paths || {};
  const categoryGroups = data.category_groups || [];
  const allPathNames = Object.keys(learningPaths);

  const groups = categoryGroups.map(g => {
    const cats = g.categories || [];
    const paths = cats
      .filter(catName => learningPaths[catName])
      .map(catName => {
        const lp = learningPaths[catName] || {};
        const bCount = (lp.beginner || []).length;
        const iCount = (lp.intermediate || []).length;
        const aCount = (lp.advanced || []).length;
        const total = bCount + iCount + aCount;
        return { name: catName, total, beginner: bCount, intermediate: iCount, advanced: aCount };
      });
    return {
      group: g.group || '',
      icon: g.icon || '',
      paths,
    };
  }).filter(g => g.paths.length > 0);

  const totalPathEntries = allPathNames.reduce((sum, name) => {
    const lp = learningPaths[name] || {};
    return sum + (lp.beginner || []).length + (lp.intermediate || []).length + (lp.advanced || []).length;
  }, 0);

  return (
    <>
      <Navbar />
      <main className="pi-page">
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
              <span className="pi-stat-num">{allPathNames.length}</span>
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

        {groups.map((g) => (
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
              {g.paths.map((p, pi) => {
                const bPct = p.total > 0 ? (p.beginner / p.total * 100) : 0;
                const iPct = p.total > 0 ? (p.intermediate / p.total * 100) : 0;
                const aPct = p.total > 0 ? (p.advanced / p.total * 100) : 0;
                return (
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
                        <div className="pi-path-bar" style={{ width: `${bPct}%`, background: '#6b9080' }} />
                        <span className="pi-path-bar-label">入门 {p.beginner}</span>
                      </div>
                      <div className="pi-path-bar-group">
                        <div className="pi-path-bar" style={{ width: `${iPct}%`, background: '#a68848' }} />
                        <span className="pi-path-bar-label">进阶 {p.intermediate}</span>
                      </div>
                      <div className="pi-path-bar-group">
                        <div className="pi-path-bar" style={{ width: `${aPct}%`, background: '#8b5e3c' }} />
                        <span className="pi-path-bar-label">高级 {p.advanced}</span>
                      </div>
                    </div>
                    <span className="pi-path-total">{p.total} 词条</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
