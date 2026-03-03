'use client'

import { useState, useEffect } from 'react'
import { BlogPost, getPosts, deletePost } from '@/lib/blog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { PenLine, BookOpen, Calendar, Tag, Trash2, Edit } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface BlogHomeProps {
  onNavigate: (view: 'home' | 'editor' | 'post', postId?: string) => void
}

export default function BlogHome({ onNavigate }: BlogHomeProps) {
  const [posts, setPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    setPosts(getPosts())
  }, [])

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('确定要删除这篇文章吗？')) {
      deletePost(id)
      setPosts(getPosts())
    }
  }

  const handleEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onNavigate('editor', id)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => onNavigate('home')}
          >
            <BookOpen className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">我的博客</h1>
          </div>
          <Button onClick={() => onNavigate('editor')} className="gap-2">
            <PenLine className="h-4 w-4" />
            写文章
          </Button>
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
            <p className="text-muted-foreground mb-6">
              点击「写文章」按钮，开始你的创作之旅
            </p>
            <Button onClick={() => onNavigate('editor')} className="gap-2">
              <PenLine className="h-4 w-4" />
              写第一篇文章
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Card 
                key={post.id} 
                className="group cursor-pointer hover:shadow-hover transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => onNavigate('post', post.id)}
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
                <CardFooter className="pt-0 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1"
                    onClick={(e) => handleEdit(post.id, e)}
                  >
                    <Edit className="h-3 w-3" />
                    编辑
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 text-destructive hover:text-destructive"
                    onClick={(e) => handleDelete(post.id, e)}
                  >
                    <Trash2 className="h-3 w-3" />
                    删除
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>使用 Markdown 写作，数据存储在本地浏览器中</p>
        </div>
      </footer>
    </div>
  )
}
