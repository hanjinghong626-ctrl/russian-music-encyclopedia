'use client';

import Link from 'next/link';

export default function CategoryGrid({ groups, categoryCounts }) {
  return (
    <section id="categories" className="section section--light">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Browse by Category</span>
          <h2 className="section-title">按分类浏览</h2>
          <div className="section-ornament">
            <span /><span className="ornament-leaf">❦</span><span />
          </div>
        </div>
        <div className="groups-list">
          {groups.map((group, gi) => (
            <div key={group.group} className="group-block">
              <div className="group-header">
                <span className="group-number">{toRoman(gi + 1)}</span>
                <h3 className="group-name">{group.group}</h3>
                <span className="group-count">{group.total_entries} 条</span>
              </div>
              <div className="cat-grid">
                {group.categories.map((catName) => {
                  const count = categoryCounts[catName] || 0;
                  return (
                    <Link key={catName} href={`/browse?category=${encodeURIComponent(catName)}`} className="cat-card">
                      <span className="cat-card-name">{catName}</span>
                      <span className="cat-card-count">{count}</span>
                      <svg className="cat-card-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function toRoman(num) {
  const romans = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'];
  return romans[num - 1] || String(num);
}
