import encyclopediaData from '../public/data/encyclopedia_unified.json';

export default function sitemap() {
  const baseUrl = 'https://russian-music-encyclopedia.vercel.app';
  const now = new Date();

  const staticPages = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // Learning path pages
  const pathPages = Object.keys(encyclopediaData.learning_paths || {}).map((name) => ({
    url: `${baseUrl}/path/${encodeURIComponent(name)}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...pathPages];
}
