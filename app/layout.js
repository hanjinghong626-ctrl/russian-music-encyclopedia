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
  title: '俄罗斯音乐辞典 | Словарь русской музыки',
  description: '从格林卡到肖斯塔科维奇，1665条中俄双语音乐术语辞典。',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className={cormorant.variable}>
      <body>{children}</body>
    </html>
  )
}
