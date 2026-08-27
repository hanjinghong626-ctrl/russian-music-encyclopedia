'use client';
import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../../home.css';

const levelLabels = {
  beginner: { label: '入门', cyr: 'Начальный', color: '#6b9080' },
  intermediate: { label: '进阶', cyr: 'Средний', color: '#a68848' },
  advanced: { label: '高级', cyr: 'Продвинутый', color: '#8b5e3c' },
};

function PathDetailContent() {
  const params = useParams();
  const pathName = decodeURIComponent(params.name);
  const [data, setData] = useState(null);
  const [activeLevel, setActiveLevel] = useState('beginner');
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [readIds, setReadIds] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/data/encyclopedia_unified.json')
      .then(r => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  // Load progress from localStorage
  useEffect(() => {
    if (!data) return;
    const storageKey = `path-progress-${pathName}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setReadIds(new Set(parsed.readIds || []));
        if (parsed.activeLevel) setActiveLevel(parsed.activeLevel);
      }
    } catch (e) {}
  }, [data, pathName]);

  // Save progress to localStorage
  const saveProgress = useCallback((newReadIds, level) => {
    const storageKey = `path-progress-${pathName}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        readIds: Array.from(newReadIds),
        activeLevel: level,
        updatedAt: Date.now(),
      }));
    } catch (e) {}
  }, [pathName]);

  const entryMap = useMemo(() => {
    if (!data?.entries) return null;
    const m = new Map();
    for (const e of data.entries) m.set(String(e.id), e);
    return m;
  }, [data]);

  const toggleExpand = useCallback((id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleRead = useCallback((id) => {
    setReadIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveProgress(next, activeLevel);
      return next;
    });
  }, [activeLevel, saveProgress]);

  const handleLevelChange = useCallback((level) => {
    setActiveLevel(level);
    setExpandedIds(new Set());
    setSearchTerm('');
    // Save level change
    saveProgress(readIds, level);
  }, [readIds, saveProgress]);

  if (!data || !entryMap) {
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
        <main className="lp-page">
          <div className="lp-header">
            <Link href="/" className="lp-breadcrumb">← 返回首页</Link>
            <h1 className="lp-title">路径未找到</h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Calculate stats
  const allLevelKeys = Object.keys(levelLabels);
  const levelStats = {};
  let totalEntries = 0;
  for (const level of allLevelKeys) {
    const ids = (pathData[level] || []).map(String);
    levelStats[level] = { ids, count: ids.length };
    totalEntries += ids.length;
  }
  const totalRead = Array.from(readIds).filter(id => entryMap.has(id)).length;
  const progressPct = totalEntries > 0 ? Math.round((totalRead / totalEntries) * 100) : 0;

  // Get entries for active level
  const activeIds = levelStats[activeLevel]?.ids || [];
  const activeEntries = activeIds.map(id => entryMap.get(id)).filter(Boolean);

  // Filter by search
  const filteredEntries = searchTerm
    ? activeEntries.filter(e =>
        e.zh.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.definition_zh || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : activeEntries;

  // Find path index in sorted list
  const sortedPaths = Object.keys(data.learning_paths).sort((a, b) => {
    const pa = data.learning_paths[a];
    const pb = data.learning_paths[b];
    const ta = (pa.beginner?.length || 0) + (pa.intermediate?.length || 0) + (pa.advanced?.length || 0);
    const tb = (pb.beginner?.length || 0) + (pb.intermediate?.length || 0) + (pb.advanced?.length || 0);
    return tb - ta;
  });
  const pathIndex = sortedPaths.indexOf(pathName);
  const prevPath = pathIndex > 0 ? sortedPaths[pathIndex - 1] : null;
  const nextPath = pathIndex < sortedPaths.length - 1 ? sortedPaths[pathIndex + 1] : null;

  return (
    <>
      <Navbar />
      <main className="lp-page">
        {/* Header */}
        <div className="lp-header">
          <Link href="/" className="lp-breadcrumb">← 学习路径</Link>
          <div className="lp-header-content">
            <h1 className="lp-title">{pathName}</h1>
            <p className="lp-subtitle">
              共 {totalEntries} 个词条 · {allLevelKeys.filter(l => levelStats[l].count > 0).length} 个级别
            </p>
          </div>
          {/* Progress bar */}
          {totalEntries > 0 && (
            <div className="lp-progress">
              <div className="lp-progress-bar">
                <div className="lp-progress-fill" style={{ width: progressPct + "%" }} />
              </div>
              <span className="lp-progress-text">
                已学 {totalRead}/{totalEntries} ({progressPct}%)
              </span>
            </div>
          )}
        </div>

        {/* Level tabs */}
        <div className="lp-tabs" role="tablist">
          {allLevelKeys.map(level => {
            const { label, cyr, color } = levelLabels[level];
            const { ids, count } = levelStats[level];
            const levelRead = ids.filter(id => readIds.has(id)).length;
            const isActive = activeLevel === level;
            return (
              <button
                key={level}
                role="tab"
                aria-selected={isActive}
                className={`lp-tab${isActive ? ' active' : ''}`}
                data-active={isActive ? 'true' : 'false'} data-level={level}
                onClick={() => handleLevelChange(level)}
              >
                <span className="lp-tab-label">{label}</span>
                <span className="lp-tab-cyr">{cyr}</span>
                <span className="lp-tab-count">{count}</span>
                {count > 0 && (
                  <span className="lp-tab-progress">
                    {levelRead}/{count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search within level */}
        {activeEntries.length > 5 && (
          <div className="lp-search">
            <input
              type="text"
              className="lp-search-input"
              placeholder="在当前级别中搜索..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Entries */}
        <div className="lp-entries" role="tabpanel">
          {filteredEntries.length === 0 ? (
            <p className="lp-empty">
              {searchTerm ? '未找到匹配词条' : '本阶段暂无词条'}
            </p>
          ) : (
            filteredEntries.map((entry, i) => {
              const entryId = String(entry.id);
              const isExpanded = expandedIds.has(entryId);
              const isRead = readIds.has(entryId);
              const seqNum = activeIds.indexOf(entryId) + 1;
              const defZh = entry.definition_zh || '';
              const isLong = defZh.length > 120;

              return (
                <div
                  key={entry.id}
                  className={`lp-card${isRead ? ' lp-read' : ''}${isExpanded ? ' lp-expanded' : ''}`}
                >
                  <div
                    className="lp-card-header"
                    onClick={() => toggleExpand(entryId)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && toggleExpand(entryId)}
                  >
                    <span className="lp-card-num">{String(seqNum).padStart(2, '0')}</span>
                    <div className="lp-card-titles">
                      <span className="lp-card-zh">{entry.zh}</span>
                      <span className="lp-card-ru">{entry.ru}</span>
                    </div>
                    <div className="lp-card-actions">
                      <button
                        className={`lp-check-btn${isRead ? ' checked' : ''}`}
                        onClick={e => { e.stopPropagation(); toggleRead(entryId); }}
                        title={isRead ? '标记为未读' : '标记为已读'}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          {isRead ? (
                            <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                          ) : (
                            <circle cx="8" cy="8" r="5.5" />
                          )}
                        </svg>
                      </button>
                      {isLong && (
                        <svg className={`lp-expand-arrow${isExpanded ? ' rotated' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M4 5.5l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  {isExpanded && defZh && (
                    <div className="lp-card-body">
                      <p className="lp-card-def">{defZh}</p>
                      {entry.category_zh && (
                        <span className="lp-card-cat">{entry.category_zh}</span>
                      )}
                    </div>
                  )}
                  {!isExpanded && defZh && !isLong && (
                    <div className="lp-card-preview">
                      <p className="lp-card-def-short">{defZh.length > 100 ? defZh.slice(0, 100) + '...' : defZh}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Navigation between paths */}
        <div className="lp-nav-footer">
          {prevPath && (
            <Link href={`/path/${encodeURIComponent(prevPath)}`} className="lp-nav-link lp-nav-prev">
              <span className="lp-nav-dir">← 上一条</span>
              <span className="lp-nav-name">{prevPath}</span>
            </Link>
          )}
          {nextPath && (
            <Link href={`/path/${encodeURIComponent(nextPath)}`} className="lp-nav-link lp-nav-next">
              <span className="lp-nav-dir">下一条 →</span>
              <span className="lp-nav-name">{nextPath}</span>
            </Link>
          )}
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
