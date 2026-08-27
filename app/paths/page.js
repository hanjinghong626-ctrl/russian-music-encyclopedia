'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../home.css';

export default function PathsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/data/encyclopedia_unified.json')
      .then(r => r.json())
      .then(setData)
      .catch(err => console.error('Failed to load data:', err));
  }, []);

  if (!data) {
    return (
      <div className="page-loading">
        <div className="page-loading-spinner" />
        <p>Загрузка…</p>
      </div>
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
          var groupTotal = g.paths.reduce(function(s, p) { return s + p.t; }, 0);
          return (
            <section key={g.group} className="pi-group">
              <div className="pi-group-header">
                <span className="pi-group-icon">{g.icon}</span>
                <div>
                  <h2 className="pi-group-title">{g.group}</h2>
                  <p className="pi-group-meta">{g.paths.length} 条路径 · {groupTotal} 个词条</p>
                </div>
              </div>
              <div className="pi-group-paths">
                {g.paths.map(function(p) {
                  var bPct = p.t > 0 ? (p.b / p.t * 100) : 0;
                  var iPct = p.t > 0 ? (p.i / p.t * 100) : 0;
                  var aPct = p.t > 0 ? (p.a / p.t * 100) : 0;
                  return (
                    <Link key={p.name} href={'/path/' + encodeURIComponent(p.name)} className="pi-path-card">
                      <div className="pi-path-top">
                        <span className="pi-path-num">{String(p.idx + 1).padStart(2, '0')}</span>
                        <span className="pi-path-name">{p.name}</span>
                      </div>
                      <div className="pi-path-bars">
                        <div className="pi-path-bar-row">
                          <span className="pi-path-bar-label">入门 {p.b}</span>
                          <div className="pi-path-bar-track">
                            <div className="pi-path-bar-fill pi-bar-beginner" style={{ width: bPct + '%' }} />
                          </div>
                        </div>
                        <div className="pi-path-bar-row">
                          <span className="pi-path-bar-label">进阶 {p.i}</span>
                          <div className="pi-path-bar-track">
                            <div className="pi-path-bar-fill pi-bar-intermediate" style={{ width: iPct + '%' }} />
                          </div>
                        </div>
                        <div className="pi-path-bar-row">
                          <span className="pi-path-bar-label">高级 {p.a}</span>
                          <div className="pi-path-bar-track">
                            <div className="pi-path-bar-fill pi-bar-advanced" style={{ width: aPct + '%' }} />
                          </div>
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
