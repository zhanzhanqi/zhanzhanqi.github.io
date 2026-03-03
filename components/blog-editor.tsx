'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import MarkdownRenderer from '@/components/markdown-renderer'
import { BlogPost, getPost, savePost, updatePost, generateExcerpt } from '@/lib/blog'
import { ArrowLeft, Eye, Edit, Save, X, Tag } from 'lucide-react'

interface BlogEditorProps {
  postId?: string
  onNavigate: (view: 'home' | 'editor' | 'post', postId?: string) => void
}

export default function BlogEditor({ postId, onNavigate }: BlogEditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const isEditing = !!postId

  useEffect(() => {
    if (postId) {
      const post = getPost(postId)
      if (post) {
        setTitle(post.title)
        setContent(post.content)
        setTags(post.tags)
      }
    }
  }, [postId])

  const handleSave = () => {
    if (!title.trim()) {
      alert('请输入文章标题')
      return
    }
    if (!content.trim()) {
      alert('请输入文章内容')
      return
    }

    setIsSaving(true)
    
    const postData = {
      title: title.trim(),
      content: content.trim(),
      excerpt: generateExcerpt(content.trim()),
      tags,
    }

    try {
      if (isEditing && postId) {
        updatePost(postId, postData)
      } else {
        savePost(postData)
      }
      onNavigate('home')
    } catch (error) {
      alert('保存失败，请重试')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsPreview(!isPreview)}
              className="gap-2"
            >
              {isPreview ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isPreview ? '编辑' : '预览'}
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? '保存中...' : (isEditing ? '更新文章' : '发布文章')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {isPreview ? (
          /* Preview Mode */
          <Card className="p-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              {title || '无标题'}
            </h1>
            {tags.length > 0 && (
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {tags.map(tag => (
                  <span 
                    key={tag}
                    className="text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <MarkdownRenderer content={content || '*没有内容*'} />
          </Card>
        ) : (
          /* Editor Mode */
          <div className="space-y-6 animate-fade-in">
            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入文章标题..."
              className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 text-foreground"
            />

            {/* Tags Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {tags.map(tag => (
                  <span 
                    key={tag}
                    className="text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded-full flex items-center gap-1"
                  >
                    {tag}
                    <button 
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="输入标签后按回车..."
                  className="text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground/50 flex-1 min-w-[150px]"
                />
              </div>
            </div>

            {/* Content Editor */}
            <Card className="overflow-hidden">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="使用 Markdown 语法开始写作...

# 这是一级标题
## 这是二级标题

**粗体文本** 和 *斜体文本*

- 列表项目一
- 列表项目二

> 引用文本

```
代码块
```"
                className="w-full min-h-[500px] p-6 bg-card text-foreground border-none outline-none resize-none font-mono text-sm leading-relaxed placeholder:text-muted-foreground/40"
              />
            </Card>

            {/* Markdown Tips */}
            <div className="text-xs text-muted-foreground space-y-1 p-4 bg-muted/50 rounded-lg">
              <p className="font-medium mb-2">Markdown 快捷提示：</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <span><code className="bg-muted px-1 rounded"># 标题</code> 一级标题</span>
                <span><code className="bg-muted px-1 rounded">**粗体**</code> 粗体</span>
                <span><code className="bg-muted px-1 rounded">*斜体*</code> 斜体</span>
                <span><code className="bg-muted px-1 rounded">`代码`</code> 行内代码</span>
                <span><code className="bg-muted px-1 rounded">- 项目</code> 无序列表</span>
                <span><code className="bg-muted px-1 rounded">1. 项目</code> 有序列表</span>
                <span><code className="bg-muted px-1 rounded">&gt; 引用</code> 引用</span>
                <span><code className="bg-muted px-1 rounded">[链接](url)</code> 链接</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
