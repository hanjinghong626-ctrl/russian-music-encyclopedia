'use client';
import Link from 'next/link';
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
    <section className="title-page">
      <span className="tp-overline">Энциклопедия русской музыки</span>
      <h1 className="tp-title">俄罗斯音乐百科</h1>
      <p className="tp-title-cyr">Русская музыкальная энциклопедия</p>
      <div className="tp-rule" />
      <p className="tp-subtitle">
        从格林卡到肖斯塔科维奇，横跨两个世纪的音乐传统。<br/>
        {totalEntries} 条中俄双语术语，{totalRefs} 条交叉引用，{categories} 个分类。
      </p>

      <form className="tp-search" onSubmit={handleSearch}>
        <input
          type="text"
          className="tp-search-input"
          placeholder="搜索术语、作曲家、作品……"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="tp-search-btn" aria-label="搜索">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" strokeLinecap="round" />
          </svg>
        </button>
      </form>

      <div className="tp-tags">
        {popularTags.map(tag => (
          <Link key={tag} href={`/browse?q=${encodeURIComponent(tag)}`} className="tp-tag">
            {tag}
          </Link>
        ))}
      </div>

      <div className="tp-stats">
        {totalEntries} 词条
        <span className="tp-stats-dot">·</span>
        {categories} 分类
        <span className="tp-stats-dot">·</span>
        {totalRefs} 引用
      </div>
    </section>
  );
}
