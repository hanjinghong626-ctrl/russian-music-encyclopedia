'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../home.css';

const levelLabels = {
  beginner: { label: '入门', cyr: 'Начальный' },
  intermediate: { label: '进阶', cyr: 'Средний' },
  advanced: { label: '高级', cyr: 'Продвинутый' },
};

function PathDetailContent() {
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
    return (
      <div className="page-loading">
        <div className="page-loading-spinner" />
        <p>Загрузка…</p>
      </div>
    );
  }

  const pathData = data.learning_paths[pathName];
  if (!pathData) {
    return (
      <>
        <Navbar />
        <main className="pd-page">
          <div className="pd-header">
            <Link href="/" className="pd-breadcrumb">← 返回首页</Link>
            <h1 className="pd-title">路径未找到</h1>
            <p className="pd-cyr">Путь не найден</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const entryIds = pathData[activeLevel] || [];
  const currentEntries = entryIds
    .map(id => data.entries.find(e => e.id === id))
    .filter(Boolean);

  return (
    <>
      <Navbar />
      <main className="pd-page">
        <div className="pd-header">
          <Link href="/" className="pd-breadcrumb">← Энциклопедия</Link>
          <h1 className="pd-title">{pathName}</h1>
          <p className="pd-cyr">Учебный путь</p>
        </div>

        <div className="pd-body">
          <div className="pd-tabs">
            {Object.entries(levelLabels).map(([key, { label, cyr }]) => (
              <button
                key={key}
                className={`pd-tab${activeLevel === key ? ' active' : ''}`}
                onClick={() => setActiveLevel(key)}
              >
                {label}
                <span className="pd-tab-count">
                  {pathData[key]?.length || 0}
                </span>
              </button>
            ))}
          </div>

          <div className="pd-entries">
            {currentEntries.length === 0 ? (
              <p className="pd-empty">本阶段暂无词条</p>
            ) : (
              currentEntries.map((entry, i) => (
                <Link
                  key={entry.id}
                  href={`/browse?q=${encodeURIComponent(entry.zh)}`}
                  className="pd-entry"
                >
                  <span className="pd-entry-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="pd-entry-zh">{entry.zh}</span>
                  <span className="pd-entry-ru">{entry.ru}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PathDetailPage() {
  return (
    <Suspense fallback={
      <div className="page-loading">
        <div className="page-loading-spinner" />
        <p>Загрузка…</p>
      </div>
    }>
      <PathDetailContent />
    </Suspense>
  );
}
