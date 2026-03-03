import { BlogPost } from '@/lib/posts'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import MarkdownRenderer from '@/components/markdown-renderer'
import { ArrowLeft, Calendar, Tag, BookOpen } from 'lucide-react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Link from 'next/link'

interface BlogPostViewProps {
  post: BlogPost
}

export default function BlogPostView({ post }: BlogPostViewProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              返回
            </Button>
          </Link>
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
          <Link href="/">
            <Button 
              variant="outline"
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              返回文章列表
            </Button>
          </Link>
        </footer>
      </article>
    </div>
  )
}
