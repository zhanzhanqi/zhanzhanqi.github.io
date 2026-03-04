import { getAllPosts, getPostById } from '@/lib/posts'
import BlogPostView from '@/components/blog-post-view'
import { notFound } from 'next/navigation'

// 生成所有文章页面的静态参数
export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => {
    // id 格式: "分类/文件名"，拆分为数组并编码
    const [category, filename] = post.id.split('/')
    return {
      id: [encodeURIComponent(category), encodeURIComponent(filename)],
    }
  })
}

interface PageProps {
  params: Promise<{ id: string[] }>
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params
  // 将数组路径重新组合为 "分类/文件名" 格式
  const postId = id.map(segment => decodeURIComponent(segment)).join('/')
  const post = getPostById(postId)

  if (!post) {
    notFound()
  }

  return <BlogPostView post={post} />
}
