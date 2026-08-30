'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import '../glossary.css';

const PAGE_SIZE = 48;

function SpeakerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

let ttsUtterance = null;
function speakRussian(text, onEnd) {
  if (!('speechSynthesis' in window)) { onEnd(null); return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ru-RU';
  u.rate = 0.85;
  u.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const ru = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('ru'));
  if (ru) u.voice = ru;
  u.onend = () => { if (ttsUtterance === u) { ttsUtterance = null; onEnd(true); } };
  u.onerror = () => { if (ttsUtterance === u) { ttsUtterance = null; onEnd(false); } };
  ttsUtterance = u;
  window.speechSynthesis.speak(u);
}

function BrowseContent() {
  const [data, setData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeEntry, setActiveEntry] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('card');
  const [qualityFilter, setQualityFilter] = useState(null);
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();
  const router = useRouter();
  const mainRef = useRef(null);
  const detailCloseRef = useRef(null);
  const lastTriggerRef = useRef(null);

  // Read URL params on mount
  useEffect(() => {
    const cat = searchParams.get('category');
    const q = searchParams.get('q');
    const view = searchParams.get('view');
    if (cat) setSelectedCategory(cat);
    if (q) setSearchQuery(q);
    if (view && ['card','list','table'].includes(view)) setViewMode(view);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync state to URL
  const updateUrl = useCallback((updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    const qs = params.toString();
    router.replace(qs ? `/browse?${qs}` : '/browse', { scroll: false });
  }, [searchParams, router]);

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/data/encyclopedia_unified.json');
        if (!res.ok) throw new Error('Failed to load');
        const json = await res.json();
        setData(json);
        setEntries(json.entries || []);
      } catch (e) {
        console.error('Failed to load encyclopedia:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Weighted search scoring
  const scoreEntry = useCallback((entry, q) => {
    if (!q) return 0;
    const ql = q.toLowerCase();
    const zh = (entry.zh || '').toLowerCase();
    const ru = (entry.ru || '').toLowerCase();
    const defZh = (entry.definition_zh || '').toLowerCase();
    const defRu = (entry.definition_ru || '').toLowerCase();

    let score = 0;
    // Exact title match
    if (zh === ql || ru === ql) score = Math.max(score, 100);
    // Title starts with
    if (zh.startsWith(ql) || ru.startsWith(ql)) score = Math.max(score, 80);
    // Title contains
    if (zh.includes(ql) || ru.includes(ql)) score = Math.max(score, 60);
    // Definition contains
    if (defZh.includes(ql)) score = Math.max(score, 10);
    if (defRu.includes(ql)) score = Math.max(score, 10);
    return score;
  }, []);

  // Filter + sort entries
  const filteredEntries = useMemo(() => {
    let result = entries;
    if (selectedCategory) {
      result = result.filter(e => e.category_zh === selectedCategory);
    }
    if (qualityFilter) {
      result = result.filter(e => e.quality === qualityFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result
        .map(e => ({ entry: e, score: scoreEntry(e, q) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score || a.entry.zh.localeCompare(b.entry.zh, 'zh'))
        .map(x => x.entry);
    }
    return result;
  }, [entries, searchQuery, selectedCategory, qualityFilter, scoreEntry]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visibleEntries = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredEntries.slice(start, start + PAGE_SIZE);
  }, [filteredEntries, safePage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, qualityFilter, viewMode]);

  // Entry lookup map
  const getEntryById = useMemo(() => {
    const map = {};
    entries.forEach(e => { map[e.id] = e; });
    return map;
  }, [entries]);

  const qualityStats = useMemo(() => {
    const s = { expert: 0, full: 0, detailed: 0, brief: 0 };
    entries.forEach(e => { if (s[e.quality] !== undefined) s[e.quality]++; });
    return s;
  }, [entries]);

  const navigateToEntry = useCallback((entryId) => {
    const entry = getEntryById[entryId];
    if (!entry) return;
    setActiveEntry(entry);
  }, [getEntryById]);

  const handleEntryClick = useCallback((entry, triggerEl) => {
    lastTriggerRef.current = triggerEl || null;
    setActiveEntry(entry);
  }, []);

  const handleCloseDetail = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    ttsUtterance = null;
    setSpeakingId(null);
    setActiveEntry(null);
    // Restore focus
    setTimeout(() => {
      if (lastTriggerRef.current) {
        lastTriggerRef.current.focus();
      }
    }, 50);
  }, []);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    ttsUtterance = null;
    setSpeakingId(null);
  }, []);

  const toggleSpeak = useCallback((e, ev) => {
    if (ev) { ev.stopPropagation(); }
    if (!e || !e.ru) return;
    if (speakingId === e.id) { stopSpeaking(); return; }
    setSpeakingId(e.id);
    speakRussian(e.ru, (ok) => {
      setSpeakingId(cur => cur === e.id ? null : cur);
    });
  }, [speakingId, stopSpeaking]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }, []);


  // Escape key + body scroll lock for modal
  useEffect(() => {
    if (!activeEntry) return;
    const onKey = (e) => {
      if (e.key === 'Escape') handleCloseDetail();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // Focus close button
    setTimeout(() => detailCloseRef.current?.focus(), 100);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [activeEntry, handleCloseDetail]);

  const groupedByCategory = useMemo(() => {
    const groups = {};
    visibleEntries.forEach(e => {
      const cat = e.category_zh;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(e);
    });
    return groups;
  }, [visibleEntries]);

  if (loading) {
    return (
      <div className="glossary-loading">
        <div className="loading-spinner"></div>
        <p>正在加载知识库...</p>
      </div>
    );
  }

  const categoryTree = data?.category_tree || {};
  const categoryGroups = data?.category_groups || [];
  const stats = data?.stats || {};
  const hasRussianDef = (e) => e.definition_ru && e.definition_ru.length > 0;
  const hasCrossRefs = (e) => e.cross_refs && e.cross_refs.length > 0;

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    updateUrl({ q: val || null, page: null });
  };
  const handleCategoryChange = (cat) => {
    const newCat = selectedCategory === cat ? null : cat;
    setSelectedCategory(newCat);
    setSelectedGroup(null);
    updateUrl({ category: newCat, page: null });
  };
  const handleViewChange = (v) => {
    setViewMode(v);
    updateUrl({ view: v, page: null });
  };
  const handleQualityChange = (q) => {
    const newQ = qualityFilter === q ? null : q;
    setQualityFilter(newQ);
    updateUrl({ page: null });
  };

  return (
    <div className="glossary-page">
      <header className="glossary-header">
        <div className="header-left">
          <a href="/" className="back-link">← 返回首页</a>
          <div className="header-title">
            <h1>俄罗斯音乐辞典</h1>
            <p className="header-subtitle">Словарь русской музыки · 1665 条中俄双语术语</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <span className="stat-num">{entries.length}</span>
            <span className="stat-label">词条</span>
          </div>
          <div className="stat-badge">
            <span className="stat-num">{stats.categories || 20}</span>
            <span className="stat-label">分类</span>
          </div>
          <div className="stat-badge">
            <span className="stat-num">{stats.cross_references?.total_references || 0}</span>
            <span className="stat-label">引用关系</span>
          </div>
        </div>
      </header>

      <div className="glossary-body">
        <aside className="glossary-sidebar">
          <div className="sidebar-search">
            <label htmlFor="search-input" className="sr-only">搜索术语</label>
            <input
              id="search-input"
              type="text"
              placeholder="搜索术语（中/俄）..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => handleSearchChange('')} aria-label="清除搜索">✕</button>
            )}
          </div>

          <div className="quality-filter-section">
            <h3 className="section-title">内容深度</h3>
            <div className="quality-filters">
              <button className={`qf-btn ${!qualityFilter ? 'active' : ''}`} onClick={() => { setQualityFilter(null); updateUrl({page:null}); }}>
                全部 <span>{entries.length}</span>
              </button>
              <button className={`qf-btn qf-expert ${qualityFilter === 'expert' ? 'active' : ''}`} onClick={() => handleQualityChange('expert')}>
                专家级 <span>{qualityStats.expert}</span>
              </button>
              <button className={`qf-btn qf-full ${qualityFilter === 'full' ? 'active' : ''}`} onClick={() => handleQualityChange('full')}>
                完整 <span>{qualityStats.full}</span>
              </button>
              <button className={`qf-btn qf-detailed ${qualityFilter === 'detailed' ? 'active' : ''}`} onClick={() => handleQualityChange('detailed')}>
                详细 <span>{qualityStats.detailed}</span>
              </button>
              <button className={`qf-btn qf-brief ${qualityFilter === 'brief' ? 'active' : ''}`} onClick={() => handleQualityChange('brief')}>
                基础 <span>{qualityStats.brief}</span>
              </button>
            </div>
          </div>

          <div className="category-section">
            <h3 className="section-title">分类导航</h3>
            <button
              className={`group-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => { setSelectedCategory(null); setSelectedGroup(null); updateUrl({category:null,page:null}); }}
            >
              全部词条
              <span className="count">{entries.length}</span>
            </button>

            {categoryGroups.map((group, gi) => (
              <div key={gi} className="category-group">
                <button
                  className={`group-header ${selectedGroup === group.group ? 'expanded' : ''}`}
                  onClick={() => setSelectedGroup(selectedGroup === group.group ? null : group.group)}
                  aria-expanded={selectedGroup === group.group}
                >
                  <span className="group-name">{group.group}</span>
                  <span className="group-count">{group.total_entries}</span>
                </button>
                {selectedGroup === group.group && (
                  <div className="group-categories">
                    {group.categories.map((cat, ci) => {
                      const treeEntry = categoryTree[cat];
                      return (
                        <button
                          key={ci}
                          className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                          onClick={() => handleCategoryChange(cat)}
                        >
                          {cat}
                          <span className="count">{treeEntry?.count || 0}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        <main className="glossary-main" ref={mainRef}>
          <div className="main-toolbar">
            <span className="result-count">
              {selectedCategory ? `${selectedCategory} · ` : ''}
              {filteredEntries.length} 条
              {searchQuery && ` · 搜索"${searchQuery}"`}
              {totalPages > 1 && ` · 第 ${safePage}/${totalPages} 页`}
            </span>
            <div className="toolbar-right">
              <div className="view-tabs" role="tablist" aria-label="视图切换">
                <button role="tab" aria-selected={viewMode==='card'}
                  className={`view-tab ${viewMode === 'card' ? 'active' : ''}`}
                  onClick={() => handleViewChange('card')} title="百科视图">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> 百科
                </button>
                <button role="tab" aria-selected={viewMode==='table'}
                  className={`view-tab ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => handleViewChange('table')} title="术语表视图">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="1"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="3" y1="16" x2="21" y2="16"/><line x1="10" y1="4" x2="10" y2="20"/><line x1="16" y1="4" x2="16" y2="20"/></svg> 术语表
                </button>
                <button role="tab" aria-selected={viewMode==='list'}
                  className={`view-tab ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => handleViewChange('list')} title="列表视图">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg> 列表
                </button>
              </div>
            </div>
          </div>

          {/* CARD VIEW */}
          {viewMode === 'card' && (
            <div className="entries-container card">
              {visibleEntries.length === 0 ? (
                <div className="no-results">
                  <p>未找到匹配的词条</p>
                  <button onClick={() => { handleSearchChange(''); setSelectedCategory(null); setQualityFilter(null); updateUrl({q:null,category:null,page:null}); }}>
                    清除筛选
                  </button>
                </div>
              ) : (
                visibleEntries.map(entry => (
                  <button
                    key={entry.id}
                    id={`entry-${entry.id}`}
                    className={`entry-card quality-${entry.quality} ${activeEntry?.id === entry.id ? 'active' : ''}`}
                    onClick={(e) => handleEntryClick(entry, e.currentTarget)}
                  >
                    <div className="entry-header">
                      <span className="entry-ru">{entry.ru}</span>
                      <button
                        type="button"
                        className={`speak-btn${speakingId === entry.id ? ' speaking' : ''}`}
                        onClick={(ev) => toggleSpeak(entry, ev)}
                        title={speakingId === entry.id ? '停止朗读' : '朗读俄语原名'}
                        aria-label={speakingId === entry.id ? '停止朗读' : `朗读俄语原名 ${entry.ru}`}
                      >
                        <SpeakerIcon />
                      </button>
                      <span className="entry-zh">{entry.zh}</span>
                      <span className={`quality-badge quality-${entry.quality}`}>
                        {entry.quality === 'expert' ? '专家' :
                         entry.quality === 'full' ? '完整' :
                         entry.quality === 'detailed' ? '详细' : '基础'}
                      </span>
                    </div>
                    <div className="entry-category">{entry.category_zh}</div>
                    <div className="entry-definition">
                      {entry.definition_zh.length > 200
                        ? entry.definition_zh.slice(0, 200) + '...'
                        : entry.definition_zh}
                    </div>
                    {hasCrossRefs(entry) && (
                      <div className="cross-refs">
                        <span className="refs-label">相关术语：</span>
                        <div className="refs-tags">
                          {entry.cross_refs.slice(0, 6).map(refId => {
                            const refEntry = getEntryById[refId];
                            if (!refEntry) return null;
                            return (
                              <button key={refId} className="ref-tag"
                                onClick={(e) => { e.stopPropagation(); navigateToEntry(refId); }}>
                                {refEntry.zh}
                              </button>
                            );
                          })}
                          {entry.cross_refs.length > 6 && (
                            <span className="ref-more">+{entry.cross_refs.length - 6}</span>
                          )}
                        </div>
                      </div>
                    )}
                    {hasRussianDef(entry) && (
                      <div className="entry-ru-def">
                        <span className="ru-label">RU:</span>
                        <span className="ru-text">
                          {entry.definition_ru.length > 100
                            ? entry.definition_ru.slice(0, 100) + '...'
                            : entry.definition_ru}
                        </span>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          )}

          {/* TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="table-view">
              {Object.keys(groupedByCategory).length === 0 ? (
                <div className="no-results"><p>未找到匹配的词条</p></div>
              ) : (
                Object.entries(groupedByCategory).map(([cat, catEntries]) => (
                  <div key={cat} className="table-group">
                    <div className="table-group-header">
                      <h3>{cat}</h3>
                      <span className="table-group-count">{catEntries.length} 条</span>
                    </div>
                    <div className="table-scroll-wrap">
                      <table className="glossary-table">
                        <thead>
                          <tr>
                            <th className="col-ru">РУССКИЙ</th>
                            <th className="col-zh">中文</th>
                            <th className="col-quality">深度</th>
                            <th className="col-refs">关联</th>
                            <th className="col-ru-def">俄语释义</th>
                          </tr>
                        </thead>
                        <tbody>
                          {catEntries.map(entry => (
                            <tr key={entry.id}
                              className={`table-row quality-${entry.quality}`}
                              onClick={(e) => handleEntryClick(entry, e.currentTarget)}
                              tabIndex={0}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleEntryClick(entry, e.currentTarget); }}
                            >
                              <td className="col-ru">
                                <span className="cell-ru-text">{entry.ru}</span>
                                <button
                                  type="button"
                                  className={`speak-btn speak-btn-sm${speakingId === entry.id ? ' speaking' : ''}`}
                                  onClick={(ev) => toggleSpeak(entry, ev)}
                                  title={speakingId === entry.id ? '停止朗读' : '朗读俄语原名'}
                                  aria-label={speakingId === entry.id ? '停止朗读' : `朗读俄语原名 ${entry.ru}`}
                                >
                                  <SpeakerIcon />
                                </button>
                              </td>
                              <td className="col-zh">{entry.zh}</td>
                              <td className="col-quality">
                                <span className={`quality-dot quality-${entry.quality}`}></span>
                              </td>
                              <td className="col-refs">
                                {hasCrossRefs(entry) && (
                                  <div className="table-refs">
                                    {entry.cross_refs.slice(0, 3).map(refId => {
                                      const refEntry = getEntryById[refId];
                                      if (!refEntry) return null;
                                      return (
                                        <button key={refId} className="table-ref-tag"
                                          onClick={(e) => { e.stopPropagation(); navigateToEntry(refId); }}
                                          title={refEntry.ru}>
                                          {refEntry.zh}
                                        </button>
                                      );
                                    })}
                                    {entry.cross_refs.length > 3 && (
                                      <span className="table-ref-more">+{entry.cross_refs.length - 3}</span>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="col-ru-def">
                                {hasRussianDef(entry) ? (
                                  <span className="ru-preview">
                                    {entry.definition_ru.length > 60 ? entry.definition_ru.slice(0, 60) + '…' : entry.definition_ru}
                                  </span>
                                ) : <span className="no-data">—</span>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <div className="entries-container list">
              {visibleEntries.length === 0 ? (
                <div className="no-results"><p>未找到匹配的词条</p></div>
              ) : (
                visibleEntries.map(entry => (
                  <button key={entry.id}
                    className={`list-item quality-${entry.quality}`}
                    onClick={(e) => handleEntryClick(entry, e.currentTarget)}
                  >
                    <span className="list-ru">{entry.ru}</span>
                    <button
                      type="button"
                      className={`speak-btn speak-btn-sm${speakingId === entry.id ? ' speaking' : ''}`}
                      onClick={(ev) => toggleSpeak(entry, ev)}
                      title={speakingId === entry.id ? '停止朗读' : '朗读俄语原名'}
                      aria-label={speakingId === entry.id ? '停止朗读' : `朗读俄语原名 ${entry.ru}`}
                    >
                      <SpeakerIcon />
                    </button>
                    <span className="list-zh">{entry.zh}</span>
                    <span className="list-cat">{entry.category_zh}</span>
                    <span className={`quality-dot quality-${entry.quality}`}></span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination" role="navigation" aria-label="分页导航">
              <button
                className="page-btn"
                disabled={safePage <= 1}
                onClick={() => { setPage(p => Math.max(1, p - 1)); mainRef.current?.scrollIntoView({behavior:'smooth'}); }}
                aria-label="上一页"
              >
                ← 上一页
              </button>
              <span className="page-info">
                {safePage} / {totalPages}
              </span>
              <button
                className="page-btn"
                disabled={safePage >= totalPages}
                onClick={() => { setPage(p => Math.min(totalPages, p + 1)); mainRef.current?.scrollIntoView({behavior:'smooth'}); }}
                aria-label="下一页"
              >
                下一页 →
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Detail Modal — accessible */}
      {activeEntry && (
        <div className="detail-overlay" role="presentation" onClick={handleCloseDetail}>
          <section
            className="detail-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`entry-title-${activeEntry.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={detailCloseRef}
              type="button"
              className="detail-close"
              onClick={handleCloseDetail}
              aria-label="关闭词条详情"
            >
              ✕
            </button>

            <div className="detail-header">
              <div className="detail-title-row">
                <h2 className="detail-ru" id={`entry-title-${activeEntry.id}`}>{activeEntry.ru}</h2>
                <button
                  type="button"
                  className={`speak-btn speak-btn-lg${speakingId === activeEntry.id ? ' speaking' : ''}`}
                  onClick={(ev) => toggleSpeak(activeEntry, ev)}
                  title={speakingId === activeEntry.id ? '停止朗读' : '朗读俄语原名'}
                  aria-label={speakingId === activeEntry.id ? '停止朗读' : `朗读俄语原名 ${activeEntry.ru}`}
                >
                  <SpeakerIcon />
                </button>
              </div>
              <h3 className="detail-zh">{activeEntry.zh}</h3>
              <div className="detail-meta">
                <button
                  className="detail-category-btn"
                  onClick={() => { handleCategoryChange(activeEntry.category_zh); handleCloseDetail(); }}
                >
                  {activeEntry.category_zh}
                </button>
                <span className={`quality-badge quality-${activeEntry.quality}`}>
                  {activeEntry.quality === 'expert' ? '专家级' :
                   activeEntry.quality === 'full' ? '完整' :
                   activeEntry.quality === 'detailed' ? '详细' : '基础'}
                </span>
              </div>
            </div>

            <div className="detail-body">
              <div className="detail-section">
                <h4>中文释义</h4>
                <p className="detail-definition">{activeEntry.definition_zh}</p>
              </div>
              {hasRussianDef(activeEntry) && (
                <div className="detail-section">
                  <h4>俄语原文</h4>
                  <p className="detail-ru-text">{activeEntry.definition_ru}</p>
                </div>
              )}
              {hasCrossRefs(activeEntry) && (
                <div className="detail-section">
                  <h4>相关术语 ({activeEntry.cross_refs.length})</h4>
                  <div className="detail-refs">
                    {activeEntry.cross_refs.map(refId => {
                      const refEntry = getEntryById[refId];
                      if (!refEntry) return null;
                      return (
                        <button key={refId} className="detail-ref-btn"
                          onClick={() => navigateToEntry(refId)}>
                          <span className="ref-ru">{refEntry.ru}</span>
                          <span className="ref-zh">{refEntry.zh}</span>
                          <span className="ref-cat">{refEntry.category_zh}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {activeEntry.back_refs && activeEntry.back_refs.length > 0 && (
                <div className="detail-section">
                  <h4>被以下术语引用 ({activeEntry.back_refs.length})</h4>
                  <div className="detail-refs">
                    {activeEntry.back_refs.map(refId => {
                      const refEntry = getEntryById[refId];
                      if (!refEntry) return null;
                      return (
                        <button key={refId} className="detail-ref-btn back-ref"
                          onClick={() => navigateToEntry(refId)}>
                          <span className="ref-ru">{refEntry.ru}</span>
                          <span className="ref-zh">{refEntry.zh}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-cormorant), serif', fontSize: '20px', color: '#7a7568' }}>
        Загрузка…
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
