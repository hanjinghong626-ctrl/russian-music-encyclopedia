import './globals.css'
import { Cormorant_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
})

export const metadata = {
  metadataBase: new URL('https://russian-music-encyclopedia.vercel.app'),
  title: {
    default: '俄罗斯音乐辞典 | Словарь русской музыки',
    template: '%s | 俄罗斯音乐辞典',
  },
  description: '从格林卡到肖斯塔科维奇，1665条中俄双语音乐术语辞典，涵盖乐理、和声、曲式、作曲家、歌剧与俄罗斯音乐学派。',
  keywords: ['俄罗斯音乐', '音乐辞典', '音乐术语', '俄语音乐', '乐理', '和声', '作曲家', '歌剧', 'Чайковский', 'Глинка'],
  authors: [{ name: '俄罗斯音乐辞典' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://russian-music-encyclopedia.vercel.app',
    siteName: '俄罗斯音乐辞典',
    title: '俄罗斯音乐辞典 | Словарь русской музыки',
    description: '1665条中俄双语音乐术语，从基础乐理到俄罗斯音乐学派。',
    images: [{
      url: '/images/hero-bg.jpg',
      width: 1920,
      height: 1080,
      alt: '俄罗斯音乐辞典',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '俄罗斯音乐辞典 | Словарь русской музыки',
    description: '1665条中俄双语音乐术语，从基础乐理到俄罗斯音乐学派。',
    images: ['/images/hero-bg.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className={cormorant.variable}>
      <body>{children}</body>
    </html>
  )
}
