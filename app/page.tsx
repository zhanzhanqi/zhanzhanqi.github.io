'use client'

import { useState } from 'react'
import BlogHome from '@/components/blog-home'
import BlogEditor from '@/components/blog-editor'
import BlogPostView from '@/components/blog-post-view'

type ViewType = 'home' | 'editor' | 'post'

export default function Page() {
  const [currentView, setCurrentView] = useState<ViewType>('home')
  const [currentPostId, setCurrentPostId] = useState<string | undefined>()

  const handleNavigate = (view: ViewType, postId?: string) => {
    setCurrentView(view)
    setCurrentPostId(postId)
  }

  return (
    <>
      {currentView === 'home' && (
        <BlogHome onNavigate={handleNavigate} />
      )}
      {currentView === 'editor' && (
        <BlogEditor postId={currentPostId} onNavigate={handleNavigate} />
      )}
      {currentView === 'post' && currentPostId && (
        <BlogPostView postId={currentPostId} onNavigate={handleNavigate} />
      )}
    </>
  )
}
