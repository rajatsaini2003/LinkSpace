export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    followers: number;
    following: number;
    bookmarks: number;
  };
  isFollowing?: boolean;
}

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export interface BookmarkTag {
  tag: Tag;
}

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
  _count?: {
    bookmarks: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  bookmarkId: string;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
}

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  isPublic: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;
  tags: BookmarkTag[];
  _count?: {
    likes: number;
    comments: number;
  };
  isLiked?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
