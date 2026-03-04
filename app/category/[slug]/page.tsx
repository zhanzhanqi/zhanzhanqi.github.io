import { getAllPosts, getAllCategories, getAllCategories as getCategories } from '@/lib/posts'
import BlogHome from '@/components/blog-home'
import { notFound } from 'next/navigation'

// 生成所有分类页面的静态参数
export function generateStaticParams() {
  const categories = getCategories()
  return categories.map(cat => ({
    slug: encodeURIComponent(cat.slug),
  }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  
  // 对 slug 进行解码（处理中文）
  const decodedSlug = decodeURIComponent(slug)
  
  // 验证分类是否存在
  const allCategories = getAllCategories()
  const categoryExists = allCategories.some(cat => cat.slug === decodedSlug)
  
  if (!categoryExists) {
    notFound()
  }

  const posts = getAllPosts(decodedSlug)
  const categories = getAllCategories()

  return <BlogHome posts={posts} categories={categories} currentCategory={decodedSlug} />
}
