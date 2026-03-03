'use client'

import { useState } from 'react'
import { BlogPost } from '@/lib/posts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { BookOpen, Calendar, Tag, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Link from 'next/link'

interface BlogHomeProps {
  posts: BlogPost[]
}

export default function BlogHome({ posts }: BlogHomeProps) {



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
      <section className="py-16 px-4 text-center bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-4xl font-bold text-foreground mb-4 animate-fade-in">
            记录思考与生活
          </h2>
          <p className="text-lg text-muted-foreground animate-slide-up">
            用文字记录每一个值得铭记的瞬间
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <main className="container mx-auto px-4 py-12">
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Link 
                key={post.id} 
                href={`/post/${post.id}`}
              >
              <Card 
                className="group cursor-pointer hover:shadow-hover transition-all duration-300 animate-slide-up h-full"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
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
