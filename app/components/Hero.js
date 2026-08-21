'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Hero({ stats }) {
  const [query, setQuery] = useState('');
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/browse?q=${encodeURIComponent(query.trim())}`;
    } else {
      window.location.href = '/browse';
    }
  };
  const popularTags = ['交响曲','歌剧','钢琴','柴可夫斯基','和声','奏鸣曲式','芭蕾舞剧','美声'];

  return (
    <section className="hero">
      <div className="hero-bg-line" />
      <div className="hero-content">
        <p className="hero-overline">Энциклопедия русской музыки</p>
        <h1 className="hero-title">俄罗斯音乐百科</h1>
        <div className="hero-divider">
          <span className="hero-divider-line" />
          <span className="hero-divider-ornament">❧</span>
          <span className="hero-divider-line" />
        </div>
        <p className="hero-slogan">
          从格林卡到肖斯塔科维奇，<br className="hidden-mobile" />
          1665 个词条的音乐之旅
        </p>
        <form className="hero-search" onSubmit={handleSearch}>
          <svg className="hero-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input type="text" className="hero-search-input" placeholder="搜索 1665 个词条，中文或俄文皆可…"
            value={query} onChange={(e) => setQuery(e.target.value)} />
          <button type="submit" className="hero-search-btn">Search</button>
        </form>
        <div className="hero-tags">
          {popularTags.map((tag) => (
            <Link key={tag} href={`/browse?q=${encodeURIComponent(tag)}`} className="hero-tag">{tag}</Link>
          ))}
        </div>
        <div className="hero-stats">
          <span>{stats.total_entries.toLocaleString()} 词条</span>
          <span className="hero-stat-dot">·</span>
          <span>{stats.categories} 分类</span>
          <span className="hero-stat-dot">·</span>
          <span>{stats.cross_references.total_references.toLocaleString()} 交叉引用</span>
        </div>
      </div>
    </section>
  );
}
