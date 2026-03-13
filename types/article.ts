export interface Post {
  userId: number
  id: number
  title: string
  body: string
}

export interface User {
  id: number
  name: string
}

export interface Author {
  id: number
  name: string
}

export interface Article {
  id: number
  title: string
  body: string
  authorId: number
  authorName: string
}

export interface ArticleListItem {
  id: number
  title: string
  excerpt: string
  authorId: number
  authorName: string
}

export interface ArticleQueryState {
  q: string
  author: string
  page: number
  pageSize: number
}

export interface ArticlesListResult {
  items: ArticleListItem[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  authors: Author[]
}

export interface FetchArticlesParams {
  q: string
  author: string
  page: number
  pageSize: number
}