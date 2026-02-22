export interface User {
  id: string
  username: string
  email: string
  displayName: string
  bio?: string
  avatarUrl?: string
  followersCount: number
  followingCount: number
  bookmarksCount: number
  collectionsCount: number
  createdAt: string
  isFollowing?: boolean
}

export interface Tag {
  id: string
  name: string
  slug: string
  bookmarksCount?: number
}

export interface Collection {
  id: string
  name: string
  description?: string
  isPublic: boolean
  coverImageUrl?: string
  bookmarksCount: number
  owner: User
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  content: string
  author: User
  bookmarkId: string
  createdAt: string
  updatedAt: string
}

export interface Bookmark {
  id: string
  url: string
  title: string
  description?: string
  imageUrl?: string
  faviconUrl?: string
  domain?: string
  isPublic: boolean
  likesCount: number
  commentsCount: number
  savesCount: number
  tags: Tag[]
  collections: Collection[]
  owner: User
  comments?: Comment[]
  isLiked?: boolean
  isSaved?: boolean
  createdAt: string
  updatedAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
  displayName: string
}

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string[]>
}
