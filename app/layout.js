import './globals.css'
import { Cormorant_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
})

export const metadata = {
  title: '俄罗斯音乐百科 | Энциклопедия русской музыки',
  description: '从格林卡到肖斯塔科维奇，1665条中俄双语音乐术语百科。涵盖音乐理论、作曲家、乐器、歌剧、芭蕾等20个分类，4333条交叉引用。',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className={cormorant.variable}>
      <body>{children}</body>
    </html>
  )
}
