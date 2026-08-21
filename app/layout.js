import './globals.css'

export const metadata = {
  title: '俄罗斯音乐百科知识库',
  description: 'Энциклопедия русской музыки · 1665条双语音乐术语百科',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
