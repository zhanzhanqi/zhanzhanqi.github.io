import './globals.css'
import { Noto_Serif_SC, Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const notoSerifSC = Noto_Serif_SC({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif'
})

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
      <body className={`${inter.variable} ${notoSerifSC.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
