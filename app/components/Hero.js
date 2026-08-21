'use client';
import { useState } from 'react';

const popularTags = ['歌剧', '芭蕾', '钢琴', '肖斯塔科维奇', '旋律', '交响曲', '里姆斯基', '声乐'];

export default function Hero({ stats }) {
  const [query, setQuery] = useState('');
  const totalEntries = stats?.total_entries || 1665;
  const totalRefs = stats?.cross_references?.total_references || 4333;
  const categories = stats?.categories || 14;

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/browse?q=${encodeURIComponent(query.trim())}`;
    }
  }

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="hero-overline">Энциклопедия русской музыки</span>
        <h1 className="hero-title">俄罗斯音乐百科</h1>
        <p className="hero-subtitle-cyr">Русская музыкальная энциклопедия</p>
        <div className="hero-divider" />
        <p className="hero-desc">
          从格林卡到肖斯塔科维奇，横跨两个世纪的音乐传统。<br/>
          <b>{totalEntries}</b> 条中俄双语术语 · <b>{totalRefs}</b> 条交叉引用 · <b>{categories}</b> 个分类
        </p>

        <form className="hero-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="搜索术语、作曲家、作品……"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" aria-label="搜索">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        <div className="hero-tags">
          {popularTags.map(tag => (
            <a key={tag} href={`/browse?q=${encodeURIComponent(tag)}`} className="hero-tag">
              {tag}
            </a>
          ))}
        </div>

        <div className="hero-stats">
          <div className="hero-stats-item">
            <strong>{totalEntries}</strong>词条
          </div>
          <div className="hero-stats-sep" />
          <div className="hero-stats-item">
            <strong>{categories}</strong>分类
          </div>
          <div className="hero-stats-sep" />
          <div className="hero-stats-item">
            <strong>{totalRefs}</strong>交叉引用
          </div>
        </div>
      </div>
    </section>
  );
}
