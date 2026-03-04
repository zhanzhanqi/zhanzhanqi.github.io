'use client'

import { useState } from 'react'
import { BlogPost, Category } from '@/lib/posts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { BookOpen, Calendar, Tag, Eye, List, Hash, Clock, FolderOpen } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Link from 'next/link'

interface BlogHomeProps {
  posts: BlogPost[]
  categories: Category[]
  currentCategory?: string
}

export default function BlogHome({ posts, categories, currentCategory }: BlogHomeProps) {
  // 编码文章链接路径
  const encodePostPath = (id: string) => {
    const [category, filename] = id.split('/')
    return `/post/${encodeURIComponent(category)}/${encodeURIComponent(filename)}`
  }

  // 提取所有标签
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)))
  
  // 按年份分组文章
  const postsByYear = posts.reduce((acc, post) => {
    const year = new Date(post.createdAt).getFullYear()
    if (!acc[year]) acc[year] = []
    acc[year].push(post)
    return acc
  }, {} as Record<number, BlogPost[]>)
  
  // 年份排序（降序）
  const sortedYears = Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a))

  // 按分类分组文章
  const postsByCategory = posts.reduce((acc, post) => {
    const cat = post.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(post)
    return acc
  }, {} as Record<string, BlogPost[]>)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <BookOpen className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">我的博客</h1>
          </Link>
          <div className="text-sm text-muted-foreground">
            共 {posts.length} 篇文章
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 text-center bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-foreground mb-4 animate-fade-in">
            记录思考与生活
          </h2>
          <p className="text-lg text-muted-foreground animate-slide-up">
            用文字记录每一个值得铭记的瞬间
          </p>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="border-b border-border bg-card/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground mr-2">分类：</span>
            <Link href="/">
              <span className={`text-sm px-4 py-2 rounded-full transition-colors cursor-pointer ${
                !currentCategory 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-primary/10'
              }`}>
                全部 ({categories.reduce((sum, cat) => sum + cat.count, 0)})
              </span>
            </Link>
            {categories.map(cat => (
              <Link key={cat.slug} href={`/category/${encodeURIComponent(cat.slug)}`}>
                <span className={`text-sm px-4 py-2 rounded-full transition-colors cursor-pointer ${
                  currentCategory === cat.slug 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground hover:bg-primary/10'
                }`}>
                  {cat.name} ({cat.count})
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          
          {/* Sidebar - Table of Contents */}
          <aside className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            {/* 分类目录 */}
            <Card className="lg:sticky lg:top-24">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  分类目录
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map(cat => (
                  <div key={cat.slug}>
                    <Link href={`/category/${encodeURIComponent(cat.slug)}`}>
                      <h4 className={`text-sm font-medium mb-2 flex items-center gap-1 cursor-pointer hover:text-primary transition-colors ${
                        currentCategory === cat.slug ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        <span className="w-2 h-2 rounded-full bg-primary/60"></span>
                        {cat.name}
                        <span className="text-xs">({cat.count})</span>
                      </h4>
                    </Link>
                    {postsByCategory[cat.name] && (
                      <ul className="space-y-1 pl-4 border-l-2 border-border">
                        {postsByCategory[cat.name].slice(0, 5).map(post => (
                          <li key={post.id}>
                            <Link 
                              href={encodePostPath(post.id)}
                              className="block group"
                            >
                              <span className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1" title={post.title}>
                                {post.title}
                              </span>
                            </Link>
                          </li>
                        ))}
                        {postsByCategory[cat.name].length > 5 && (
                          <li className="text-xs text-muted-foreground">
                            还有 {postsByCategory[cat.name].length - 5} 篇...
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 文章归档 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <List className="h-5 w-5 text-primary" />
                  文章归档
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sortedYears.map(year => (
                  <div key={year}>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {year}年
                      <span className="text-xs">({postsByYear[Number(year)].length})</span>
                    </h4>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 标签云 */}
            {allTags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Hash className="h-5 w-5 text-primary" />
                    标签
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => {
                      const count = posts.filter(p => p.tags.includes(tag)).length
                      return (
                        <span 
                          key={tag}
                          className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                        >
                          {tag} ({count})
                        </span>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 统计信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  博客统计
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">文章总数</span>
                  <span className="font-medium">{posts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">分类数量</span>
                  <span className="font-medium">{categories.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">标签总数</span>
                  <span className="font-medium">{allTags.length}</span>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Posts Grid */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* 当前分类标题 */}
            {currentCategory && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <FolderOpen className="h-6 w-6 text-primary" />
                  {currentCategory}
                  <span className="text-base font-normal text-muted-foreground">
                    ({posts.length} 篇文章)
                  </span>
                </h2>
              </div>
            )}

            {posts.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-muted-foreground mb-2">
                  还没有文章
                </h3>
                <p className="text-muted-foreground">
                  在 content/posts 目录添加 Markdown 文件
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post, index) => (
                  <Link 
                    key={post.id} 
                    href={encodePostPath(post.id)}
                  >
                  <Card 
                    className="group cursor-pointer hover:shadow-hover transition-all duration-300 animate-slide-up h-full"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                          {post.category}
                        </span>
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(post.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                      {post.tags.length > 0 && (
                        <div className="flex items-center gap-2 mt-4 flex-wrap">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          {post.tags.map(tag => (
                            <span 
                              key={tag}
                              className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        阅读更多
                      </div>
                    </CardFooter>
                  </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>使用 Markdown 写作，静态生成部署</p>
        </div>
      </footer>
    </div>
  )
}
