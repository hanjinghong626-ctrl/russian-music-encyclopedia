'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../home.css';

export default function PathIndexPage() {
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/data/encyclopedia_unified.json')
      .then(function(res) {
        if (!res.ok) throw new Error('fetch failed');
        return res.json();
      })
      .then(function(json) {
        if (!cancelled) setData(json);
      })
      .catch(function(err) {
        if (!cancelled) setLoadError(true);
      });
    return function() { cancelled = true; };
  }, []);

  if (loadError) {
    return (
      <>
        <Navbar />
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
          <p style={{ color: '#9a9488', fontSize: 18 }}>数据加载失败，请刷新重试。</p>
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
          <p style={{ color: '#9a9488', fontSize: 16, fontFamily: 'var(--font-cormorant), serif' }}>Загрузка…</p>
        </main>
        <Footer />
      </>
    );
  }

  var paths = data.learning_paths || {};
  var groups = data.category_groups || [];
  var pathNames = Object.keys(paths);

  var totalEntries = 0;
  pathNames.forEach(function(name) {
    var p = paths[name] || {};
    totalEntries += ((p.beginner || []).length + (p.intermediate || []).length + (p.advanced || []).length);
  });

  var renderedGroups = groups.map(function(g) {
    var cats = g.categories || [];
    var groupPaths = cats
      .filter(function(c) { return paths[c]; })
      .map(function(catName, idx) {
        var lp = paths[catName] || {};
        var b = (lp.beginner || []).length;
        var i = (lp.intermediate || []).length;
        var a = (lp.advanced || []).length;
        var t = b + i + a;
        return { name: catName, b: b, i: i, a: a, t: t, idx: idx };
      });
    if (groupPaths.length === 0) return null;
    return { group: g.group, icon: g.icon, paths: groupPaths };
  }).filter(Boolean);

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
            系统化的音乐术语学习路线。每条路径按入门、进阶、高级三个阶段编排，从基础概念到专业术语循序渐进。
          </p>
          <div className="pi-stats">
            <div className="pi-stat">
              <span className="pi-stat-num">{pathNames.length}</span>
              <span className="pi-stat-label">学习路径</span>
            </div>
            <div className="pi-stat">
              <span className="pi-stat-num">{totalEntries}</span>
              <span className="pi-stat-label">词条总量</span>
            </div>
            <div className="pi-stat">
              <span className="pi-stat-num">{renderedGroups.length}</span>
              <span className="pi-stat-label">知识领域</span>
            </div>
          </div>
        </div>

        {renderedGroups.map(function(g) {
          return (
            <section key={g.group} className="pi-group">
              <div className="pi-group-header">
                <span className="pi-group-icon">{g.icon}</span>
                <div>
                  <h2 className="pi-group-title">{g.group}</h2>
                  <p className="pi-group-meta">
                    {g.paths.length} 条路径 · {g.paths.reduce(function(s, p) { return s + p.t; }, 0)} 个词条
                  </p>
                </div>
              </div>
              <div className="pi-group-paths">
                {g.paths.map(function(p) {
                  return (
                    <Link key={p.name} href={'/path/' + encodeURIComponent(p.name)} className="pi-path-card">
                      <div className="pi-path-top">
                        <span className="pi-path-num">{String(p.idx + 1).padStart(2, '0')}</span>
                        <span className="pi-path-name">{p.name}</span>
                      </div>
                      <div className="pi-path-bars">
                        <div className="pi-path-bar-group">
                          <div className="pi-path-bar" style={{ width: (p.t > 0 ? (p.b / p.t * 100) : 0) + '%', background: '#6b9080' }} />
                          <span className="pi-path-bar-label">入门 {p.b}</span>
                        </div>
                        <div className="pi-path-bar-group">
                          <div className="pi-path-bar" style={{ width: (p.t > 0 ? (p.i / p.t * 100) : 0) + '%', background: '#a68848' }} />
                          <span className="pi-path-bar-label">进阶 {p.i}</span>
                        </div>
                        <div className="pi-path-bar-group">
                          <div className="pi-path-bar" style={{ width: (p.t > 0 ? (p.a / p.t * 100) : 0) + '%', background: '#8b5e3c' }} />
                          <span className="pi-path-bar-label">高级 {p.a}</span>
                        </div>
                      </div>
                      <span className="pi-path-total">{p.t} 词条</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
      <Footer />
    </>
  );
}
