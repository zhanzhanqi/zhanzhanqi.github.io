import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '我的博客 | 记录思考与生活',
  description: '一个简洁优雅的个人博客，分享技术文章和生活感悟',
  keywords: ['博客', '技术', '个人', 'markdown'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}
