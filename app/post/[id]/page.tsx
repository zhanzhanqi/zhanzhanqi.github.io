import { getAllPostIds, getPostById } from '@/lib/posts'
import BlogPostView from '@/components/blog-post-view'
import { notFound } from 'next/navigation'

// 生成所有文章页面的静态参数
export function generateStaticParams() {
  const ids = getAllPostIds()
  return ids.map(id => ({
    id: id,
  }))
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params
  const post = getPostById(id)

  if (!post) {
    notFound()
  }

  return <BlogPostView post={post} />
}
