import type {
  Article,
  ArticleListItem,
  Author,
  ArticlesListResult,
  FetchArticlesParams,
  Post,
  User,
} from '~/types/article'

function toExcerpt(body: string, max = 140): string {
  const clean = body.replace(/\s+/g, ' ').trim()
  return clean.length > max ? `${clean.slice(0, max)}…` : clean
}

function mapAuthors(users: User[]): Author[] {
  return users
    .map((user) => ({
      id: user.id,
      name: user.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

function mapArticles(posts: Post[], users: User[]): Article[] {
  const usersMap = new Map<number, string>(
    users.map((user) => [user.id, user.name])
  )

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    body: post.body,
    authorId: post.userId,
    authorName: usersMap.get(post.userId) ?? 'Unknown author',
  }))
}

export function useArticlesApi() {
  async function fetchPosts(): Promise<Post[]> {
    return await $fetch<Post[]>('https://jsonplaceholder.typicode.com/posts')
  }

  async function fetchUsers(): Promise<User[]> {
    return await $fetch<User[]>('https://jsonplaceholder.typicode.com/users')
  }

  async function fetchArticles(params: FetchArticlesParams): Promise<ArticlesListResult> {
    const [posts, users] = await Promise.all([fetchPosts(), fetchUsers()])

    const authors = mapAuthors(users)
    const articles = mapArticles(posts, users)

    const q = params.q.trim().toLowerCase()
    const authorId = Number(params.author)
    const safePageSize = Math.max(1, params.pageSize)

    const filtered = articles.filter((article) => {
      const matchesQuery = q
        ? article.title.toLowerCase().includes(q)
        : true

      const matchesAuthor =
        params.author && Number.isFinite(authorId)
          ? article.authorId === authorId
          : true

      return matchesQuery && matchesAuthor
    })

    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / safePageSize))
    const page = Math.min(Math.max(1, params.page), totalPages)
    const start = (page - 1) * safePageSize
    const end = start + safePageSize

    const items: ArticleListItem[] = filtered.slice(start, end).map((article) => ({
      id: article.id,
      title: article.title,
      excerpt: toExcerpt(article.body),
      authorId: article.authorId,
      authorName: article.authorName,
    }))

    return {
      items,
      total,
      page,
      pageSize: safePageSize,
      totalPages,
      authors,
    }
  }

  async function fetchArticleById(id: number): Promise<Article | null> {
    try {
      const post = await $fetch<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`)
      const user = await $fetch<User>(`https://jsonplaceholder.typicode.com/users/${post.userId}`)

      return {
        id: post.id,
        title: post.title,
        body: post.body,
        authorId: post.userId,
        authorName: user.name,
      }
    } catch {
      return null
    }
  }

  async function fetchRelatedArticles(article: Article, limit = 3): Promise<ArticleListItem[]> {
    const [posts, users] = await Promise.all([fetchPosts(), fetchUsers()])
    const articles = mapArticles(posts, users)

    return articles
      .filter((item) => item.authorId === article.authorId && item.id !== article.id)
      .sort((a, b) => a.id - b.id)
      .slice(0, limit)
      .map((item) => ({
        id: item.id,
        title: item.title,
        excerpt: toExcerpt(item.body),
        authorId: item.authorId,
        authorName: item.authorName,
      }))
  }

  return {
    fetchArticles,
    fetchArticleById,
    fetchRelatedArticles,
  }
}