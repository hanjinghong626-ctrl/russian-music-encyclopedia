'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../home.css';

export default function PathDetailPage() {
  const params = useParams();
  const pathName = decodeURIComponent(params.name);
  const [data, setData] = useState(null);
  const [activeLevel, setActiveLevel] = useState('beginner');

  useEffect(() => {
    fetch('/data/encyclopedia_unified.json')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return <div className="page-loading"><div className="page-loading-spinner" /><p>Загрузка…</p></div>;
  }

  const entryMap = {};
  data.entries.forEach(e => { entryMap[e.id] = e; });
  const pathData = data.learning_paths[pathName];

  if (!pathData) {
    return (
      <>
        <Navbar />
        <div className="path-not-found">
          <h1>路径未找到</h1>
          <Link href="/#paths">返回学习路径</Link>
        </div>
        <Footer />
      </>
    );
  }

  const levels = [
    { key: 'beginner', label: '入门' },
    { key: 'intermediate', label: '进阶' },
    { key: 'advanced', label: '高级' },
  ];
  const currentEntries = (pathData[activeLevel] || []).map(id => entryMap[id]).filter(Boolean);

  return (
    <>
      <Navbar />
      <main className="path-detail">
        <div className="path-detail-header">
          <div className="container">
            <Link href="/#paths" className="breadcrumb">← 返回学习路径</Link>
            <h1 className="path-detail-title">{pathName}</h1>
            <p className="path-detail-subtitle">
              {(pathData.beginner||[]).length} 入门 · {(pathData.intermediate||[]).length} 进阶 · {(pathData.advanced||[]).length} 高级
            </p>
          </div>
        </div>
        <div className="path-detail-body container">
          <div className="path-level-tabs">
            {levels.map(lv => (
              <button key={lv.key}
                className={`path-tab ${activeLevel === lv.key ? 'active' : ''}`}
                onClick={() => setActiveLevel(lv.key)}>
                <span className="path-tab-label">{lv.label}</span>
                <span className="path-tab-count">{(pathData[lv.key]||[]).length}</span>
              </button>
            ))}
          </div>
          <div className="path-entries">
            {currentEntries.map((entry, i) => (
              <Link key={entry.id} href={`/browse?q=${encodeURIComponent(entry.zh)}`} className="path-entry">
                <span className="path-entry-num">{String(i + 1).padStart(2, '0')}</span>
                <div className="path-entry-content">
                  <span className="path-entry-zh">{entry.zh}</span>
                  {entry.ru && <span className="path-entry-ru">{entry.ru}</span>}
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="path-entry-arrow">
                  <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
