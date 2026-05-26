// API types matching backend DTOs

export interface ApiGame {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  coverImage: string;
  screenshots: string[];
  developer: string;
  publisher: string;
  releaseDate: string;
  genres: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  positivePercentage: number;
  features: string[];
  systemRequirements: {
    minimum: { os: string; processor: string; memory: string; graphics: string; storage: string };
    recommended: { os: string; processor: string; memory: string; graphics: string; storage: string };
  };
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  level: number;
  xp: number;
  country?: string;
  bio?: string;
  friendCount: number;
  gamesOwned: number;
  badges: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiReview {
  id: string;
  gameId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: string;
  hoursPlayed: number;
  content: string;
  date: string;
  helpful: number;
  funny: number;
}

export interface ApiCartItem {
  gameId: string;
  title: string;
  coverImage: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  addedAt: string;
}

export interface ApiWishlistItem {
  gameId: string;
  title: string;
  coverImage: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  positivePercentage: number;
  addedAt: string;
}

export interface ApiLibraryItem {
  gameId: string;
  title: string;
  coverImage: string;
  developer: string;
  genres: string[];
  rating: number;
  acquiredAt: string;
}

export interface ApiOrder {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: ApiOrderItem[];
}

export interface ApiOrderItem {
  gameId: string;
  title: string;
  coverImage: string;
  pricePaid: number;
}

export interface ApiGenre {
  id: string;
  name: string;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GameQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  genre?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  username?: string;
}

export interface CreateReviewRequest {
  gameId: string;
  rating: "positive" | "negative";
  hoursPlayed: number;
  content: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiFriend {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  status: "none" | "pending_sent" | "pending_received" | "accepted";
  isRequester: boolean;
}

export interface ApiMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  sentAt: string;
}
