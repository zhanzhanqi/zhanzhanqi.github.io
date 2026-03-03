import { getAllPosts, getAllPostIds, getPostById } from '@/lib/posts'
import BlogHome from '@/components/blog-home'
import BlogPostView from '@/components/blog-post-view'

// 生成所有文章页面的静态参数
export function generateStaticParams() {
  const ids = getAllPostIds()
  return ids.map(id => ({
    postId: id,
  }))
}

export default function Page() {
  const posts = getAllPosts()

  return <BlogHome posts={posts} />
}
