// ── User ──
export interface User {
  id: string
  username: string
  email: string
  displayName: string | null
  bio: string | null
  avatarUrl: string | null
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface UserProfile extends Omit<User, 'email' | 'updatedAt'> {
  _count: {
    bookmarks: number
    followers: number
    following: number
  }
  isFollowing?: boolean
}

export interface CurrentUser extends User {
  _count: {
    bookmarks: number
    followers: number
    following: number
  }
}

// ── Auth ──
export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  username: string
  email: string
  password: string
  displayName?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

// ── Bookmark ──
export interface Tag {
  id: string
  name: string
  createdAt?: string
  bookmarkCount?: number
}

export interface BookmarkUser {
  id: string
  username: string
  displayName: string | null
  avatarUrl: string | null
}

export interface Bookmark {
  id: string
  url: string
  title: string
  description: string | null
  imageUrl: string | null
  isPublic: boolean
  userId: string
  createdAt: string
  updatedAt: string
  user: BookmarkUser
  tags: Tag[]
  _count: {
    likes: number
    comments: number
  }
  isLiked: boolean
  isSaved: boolean
}

export interface BookmarkDetail extends Bookmark {
  comments: Comment[]
}

export interface CreateBookmarkInput {
  url: string
  title: string
  description?: string
  imageUrl?: string
  isPublic?: boolean
  tags?: string[]
  collectionIds?: string[]
}

export interface UpdateBookmarkInput {
  url?: string
  title?: string
  description?: string
  imageUrl?: string | null
  isPublic?: boolean
  tags?: string[]
  collectionIds?: string[]
}

// ── Collection ──
export interface Collection {
  id: string
  name: string
  description: string | null
  isPublic: boolean
  shareSlug: string
  userId: string
  createdAt: string
  updatedAt: string
  user: BookmarkUser
  _count: {
    bookmarks: number
  }
}

export interface CollectionDetail extends Collection {
  bookmarks: (Bookmark & { addedAt: string })[]
}

export interface CollectionWithSaveStatus {
  id: string
  name: string
  description: string | null
  isPublic: boolean
  _count: { bookmarks: number }
  isSaved: boolean
}

export interface CreateCollectionInput {
  name: string
  description?: string
  isPublic?: boolean
}

// ── Comment ──
export interface Comment {
  id: string
  content: string
  userId: string
  bookmarkId: string
  createdAt: string
  updatedAt: string
  user: BookmarkUser
}

// ── Feed / Pagination ──
export interface PaginatedResponse<T> {
  bookmarks: T[]
  total: number
  page: number
  limit: number
  hasNextPage: boolean
}

export interface PaginatedComments {
  comments: Comment[]
  total: number
  page: number
  limit: number
  hasNextPage: boolean
}

// ── API Envelope ──
export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
  meta?: {
    page: number
    limit: number
    total: number
    hasNextPage: boolean
  }
}

// ── Chat ──
export interface Message {
  id: string
  content: string
  conversationId: string
  senderId: string
  createdAt: string
  isRead: boolean
  sender: BookmarkUser
}

export interface Conversation {
  id: string
  createdAt: string
  updatedAt: string
  participants: BookmarkUser[]
  lastMessage: Message | null
  unreadCount: number
}

// ── Followers / Following ──
export interface FollowUser {
  id: string
  username: string
  displayName: string | null
  bio: string | null
  avatarUrl: string | null
  isPublic: boolean
  createdAt: string
}

export interface FollowListResponse {
  followers?: FollowUser[]
  following?: FollowUser[]
  total: number
  page: number
  limit: number
  hasNextPage: boolean
}
