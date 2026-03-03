'use client'

import { useState, useEffect } from 'react'
import { BlogPost, getPost } from '@/lib/blog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import MarkdownRenderer from '@/components/markdown-renderer'
import { ArrowLeft, Calendar, Tag, Edit, BookOpen } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface BlogPostViewProps {
  postId: string
  onNavigate: (view: 'home' | 'editor' | 'post', postId?: string) => void
}

export default function BlogPostView({ postId, onNavigate }: BlogPostViewProps) {
  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    const foundPost = getPost(postId)
    setPost(foundPost)
  }, [postId])

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-muted-foreground mb-4">文章不存在</h2>
          <Button onClick={() => onNavigate('home')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('home')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
          <Button 
            variant="outline"
            onClick={() => onNavigate('editor', postId)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            编辑文章
          </Button>
        </div>
      </header>

      {/* Article */}
      <article className="container mx-auto px-4 py-12 max-w-3xl animate-fade-in">
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(post.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}
            </span>
            {post.updatedAt !== post.createdAt && (
              <span className="text-xs">
                (更新于 {format(new Date(post.updatedAt), 'yyyy年MM月dd日', { locale: zhCN })})
              </span>
            )}
          </div>

          {post.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {post.tags.map(tag => (
                <span 
                  key={tag}
                  className="text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <Card className="p-8 md:p-12">
          <MarkdownRenderer content={post.content} />
        </Card>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline"
              onClick={() => onNavigate('home')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              返回文章列表
            </Button>
            <Button 
              variant="ghost"
              onClick={() => onNavigate('editor', postId)}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              编辑这篇文章
            </Button>
          </div>
        </footer>
      </article>
    </div>
  )
}
