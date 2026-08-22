export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://russian-music-encyclopedia.vercel.app/sitemap.xml',
    host: 'https://russian-music-encyclopedia.vercel.app',
  }
}
