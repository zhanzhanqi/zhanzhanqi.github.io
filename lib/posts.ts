import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// 文章类型定义
export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  category: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

// 分类类型
export interface Category {
  name: string
  slug: string
  count: number
}

const postsDirectory = path.join(process.cwd(), 'content/posts')

// 获取所有分类
export function getAllCategories(): Category[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const items = fs.readdirSync(postsDirectory, { withFileTypes: true })
  const categories = items
    .filter(item => item.isDirectory())
    .map(dir => {
      const categoryPath = path.join(postsDirectory, dir.name)
      const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.md'))
      return {
        name: dir.name,
        slug: dir.name,
        count: files.length
      }
    })
    .filter(cat => cat.count > 0)

  return categories
}

// 获取所有文章（可选按分类筛选）
export function getAllPosts(category?: string): BlogPost[] {
  const categories = category ? [category] : getAllCategories().map(c => c.slug)
  
  let allPosts: BlogPost[] = []

  for (const cat of categories) {
    const categoryPath = path.join(postsDirectory, cat)
    if (!fs.existsSync(categoryPath)) continue

    const fileNames = fs.readdirSync(categoryPath)
    const posts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const id = `${cat}/${fileName.replace(/\.md$/, '')}`
        const fullPath = path.join(categoryPath, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
          id,
          title: data.title || '无标题',
          content,
          excerpt: generateExcerpt(content),
          category: data.category || cat,
          createdAt: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
          updatedAt: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
          tags: data.tags || [],
        }
      })

    allPosts = allPosts.concat(posts)
  }

  // 按日期降序排序
  return allPosts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

// 获取单篇文章
export function getPostById(id: string): BlogPost | null {
  try {
    // id 格式: "category/filename"
    const [category, filename] = id.split('/')
    if (!category || !filename) return null

    const fullPath = path.join(postsDirectory, category, `${filename}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      id,
      title: data.title || '无标题',
      content,
      excerpt: generateExcerpt(content),
      category: data.category || category,
      createdAt: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      updatedAt: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      tags: data.tags || [],
    }
  } catch {
    return null
  }
}

// 获取所有文章 ID（用于静态生成）
export function getAllPostIds(): string[] {
  const posts = getAllPosts()
  return posts.map(post => post.id)
}

// 从 markdown 内容生成摘要
function generateExcerpt(content: string, maxLength: number = 150): string {
  // 移除 markdown 语法
  const text = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*|__/g, '')
    .replace(/\*|_/g, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n/g, ' ')
    .trim()

  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}
