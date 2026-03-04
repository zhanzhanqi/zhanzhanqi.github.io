import { getAllPosts, getAllCategories, getAllPostIds } from '@/lib/posts'
import BlogHome from '@/components/blog-home'

// 生成所有文章页面的静态参数
export function generateStaticParams() {
  const ids = getAllPostIds()
  return ids.map(id => ({
    postId: id,
  }))
}

export default function Page() {
  const posts = getAllPosts()
  const categories = getAllCategories()

  return <BlogHome posts={posts} categories={categories} />
}
