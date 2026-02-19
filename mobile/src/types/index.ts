export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Post {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; username: string };
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: string;
  user: { id: string; username: string };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LikeResponse {
  liked: boolean;
  likesCount: number;
}
