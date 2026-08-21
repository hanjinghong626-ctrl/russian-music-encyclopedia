'use client';

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ViewsSection from './components/ViewsSection';
import LearningPaths from './components/LearningPaths';
import Footer from './components/Footer';
import './home.css';

export default function HomePage() {
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

  const categoryCounts = {};
  data.entries.forEach(e => {
    if (e.category_zh) categoryCounts[e.category_zh] = (categoryCounts[e.category_zh] || 0) + 1;
  });

  return (
    <>
      <Navbar />
      <main>
        <Hero stats={data.stats} />
        <CategoryGrid groups={data.category_groups} categoryCounts={categoryCounts} />
        <ViewsSection />
        <LearningPaths paths={data.learning_paths} entries={data.entries} />
      </main>
      <Footer />
    </>
  );
}
