// 博客文章类型定义
export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

// localStorage key
const STORAGE_KEY = 'blog_posts'

// 获取所有文章
export function getPosts(): BlogPost[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return getDefaultPosts()
  try {
    return JSON.parse(data)
  } catch {
    return getDefaultPosts()
  }
}

// 获取单篇文章
export function getPost(id: string): BlogPost | null {
  const posts = getPosts()
  return posts.find(post => post.id === id) || null
}

// 保存文章
export function savePost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): BlogPost {
  const posts = getPosts()
  const now = new Date().toISOString()
  const newPost: BlogPost = {
    ...post,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }
  posts.unshift(newPost)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  return newPost
}

// 更新文章
export function updatePost(id: string, updates: Partial<Omit<BlogPost, 'id' | 'createdAt'>>): BlogPost | null {
  const posts = getPosts()
  const index = posts.findIndex(post => post.id === id)
  if (index === -1) return null
  
  posts[index] = {
    ...posts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  return posts[index]
}

// 删除文章
export function deletePost(id: string): boolean {
  const posts = getPosts()
  const filtered = posts.filter(post => post.id !== id)
  if (filtered.length === posts.length) return false
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return true
}

// 生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 从 markdown 内容生成摘要
export function generateExcerpt(content: string, maxLength: number = 150): string {
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

// 默认示例文章
function getDefaultPosts(): BlogPost[] {
  const now = new Date().toISOString()
  return [
    {
      id: 'welcome',
      title: '欢迎来到我的博客',
      content: `# 欢迎来到我的博客

这是一个支持 **Markdown** 语法的个人博客系统。

## 功能特点

- 支持完整的 Markdown 语法
- 本地存储，无需后端服务器
- 简洁优雅的设计风格

## 开始使用

点击右上角的「写文章」按钮，开始创作你的第一篇文章吧！

### 代码示例

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

> 引用文本示例

希望你能喜欢这个博客！`,
      excerpt: '这是一个支持 Markdown 语法的个人博客系统。支持完整的 Markdown 语法，本地存储，无需后端服务器...',
      createdAt: now,
      updatedAt: now,
      tags: ['介绍', '博客']
    },
    {
      id: 'markdown-guide',
      title: 'Markdown 语法指南',
      content: `# Markdown 语法指南

Markdown 是一种轻量级标记语言，让你可以使用简单的语法写出漂亮的文档。

## 标题

使用 \`#\` 符号来创建标题：

\`\`\`markdown
# 一级标题
## 二级标题
### 三级标题
\`\`\`

## 文本格式

- **粗体文本** 使用 \`**粗体**\`
- *斜体文本* 使用 \`*斜体*\`
- ~~删除线~~ 使用 \`~~删除线~~\`

## 列表

无序列表使用 \`-\` 或 \`*\`：

- 项目一
- 项目二
- 项目三

有序列表使用数字：

1. 第一步
2. 第二步
3. 第三步

## 链接和图片

[链接文本](https://example.com)

![图片描述](https://example.com/image.jpg)

## 代码

行内代码使用反引号：\`code\`

代码块使用三个反引号：

\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

## 引用

> 这是一段引用文本
> 可以跨多行

## 表格

| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A1  | B1  | C1  |
| A2  | B2  | C2  |

---

现在你已经掌握了基本的 Markdown 语法，开始写作吧！`,
      excerpt: 'Markdown 是一种轻量级标记语言，让你可以使用简单的语法写出漂亮的文档...',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      tags: ['教程', 'Markdown']
    }
  ]
}
