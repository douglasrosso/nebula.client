import type {
  ApiGame,
  ApiUser,
  ApiReview,
  ApiCartItem,
  ApiWishlistItem,
  ApiLibraryItem,
  ApiOrder,
  ApiGenre,
  PaginatedResult,
  GameQuery,
  LoginRequest,
  CreateUserRequest,
  CreateReviewRequest,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://localhost:3000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Erro desconhecido" }));
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (dto: LoginRequest) =>
    request<{ message: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  logout: () =>
    request<{ message: string }>("/api/auth/logout", { method: "POST" }),
};

// ── Users ─────────────────────────────────────────────────────────────────────

export const usersApi = {
  me: () => request<ApiUser>("/api/users/me"),

  create: (dto: CreateUserRequest) =>
    request<ApiUser>("/api/users", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  update: (id: string, dto: Partial<ApiUser>) =>
    request<ApiUser>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(dto),
    }),
};

// ── Games ─────────────────────────────────────────────────────────────────────

export const gamesApi = {
  list: (query: GameQuery = {}) => {
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.pageSize) params.set("pageSize", String(query.pageSize));
    if (query.search) params.set("search", query.search);
    if (query.genre) params.set("genre", query.genre);
    if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
    if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
    if (query.sortBy) params.set("sortBy", query.sortBy);
    const qs = params.toString();
    return request<PaginatedResult<ApiGame>>(`/api/games${qs ? `?${qs}` : ""}`);
  },

  getById: (id: string) => request<ApiGame>(`/api/games/${id}`),

  genres: () => request<ApiGenre[]>("/api/games/genres"),
};

// ── Reviews ───────────────────────────────────────────────────────────────────

export const reviewsApi = {
  forGame: (gameId: string) => request<ApiReview[]>(`/api/reviews/game/${gameId}`),

  create: (dto: CreateReviewRequest) =>
    request<ApiReview>("/api/reviews", {
      method: "POST",
      body: JSON.stringify(dto),
    }),

  markHelpful: (id: string) =>
    request<void>(`/api/reviews/${id}/helpful`, { method: "POST" }),

  markFunny: (id: string) =>
    request<void>(`/api/reviews/${id}/funny`, { method: "POST" }),

  delete: (id: string) =>
    request<void>(`/api/reviews/${id}`, { method: "DELETE" }),
};

// ── Cart ──────────────────────────────────────────────────────────────────────

export const cartApi = {
  get: () => request<ApiCartItem[]>("/api/cart"),

  add: (gameId: string) =>
    request<void>(`/api/cart/${gameId}`, { method: "POST" }),

  remove: (gameId: string) =>
    request<void>(`/api/cart/${gameId}`, { method: "DELETE" }),

  clear: () => request<void>("/api/cart", { method: "DELETE" }),
};

// ── Wishlist ──────────────────────────────────────────────────────────────────

export const wishlistApi = {
  get: () => request<ApiWishlistItem[]>("/api/wishlist"),

  add: (gameId: string) =>
    request<void>(`/api/wishlist/${gameId}`, { method: "POST" }),

  remove: (gameId: string) =>
    request<void>(`/api/wishlist/${gameId}`, { method: "DELETE" }),
};

// ── Library ───────────────────────────────────────────────────────────────────

export const libraryApi = {
  get: () => request<ApiLibraryItem[]>("/api/library"),

  isOwned: (gameId: string) =>
    request<{ owned: boolean }>(`/api/library/${gameId}/owned`),
};

// ── Orders ────────────────────────────────────────────────────────────────────

export const ordersApi = {
  list: () => request<ApiOrder[]>("/api/orders"),

  getById: (id: string) => request<ApiOrder>(`/api/orders/${id}`),

  checkout: () => request<ApiOrder>("/api/orders/checkout", { method: "POST" }),
};
