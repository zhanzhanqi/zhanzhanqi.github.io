import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// 文章类型定义
export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

const postsDirectory = path.join(process.cwd(), 'content/posts')

// 获取所有文章
export function getAllPosts(): BlogPost[] {
  // 确保目录存在
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const id = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        id,
        title: data.title || '无标题',
        content,
        excerpt: generateExcerpt(content),
        createdAt: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        updatedAt: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        tags: data.tags || [],
      }
    })

  // 按日期降序排序
  return allPosts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

// 获取单篇文章
export function getPostById(id: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      id,
      title: data.title || '无标题',
      content,
      excerpt: generateExcerpt(content),
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
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''))
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
