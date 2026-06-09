import type {
  ApiGame,
  ApiGameDetail,
  ApiUser,
  ApiWishlistItem,
  ApiLibraryItem,
  ApiGenre,
  PaginatedResult,
  GameQuery,
  LoginRequest,
  CreateUserRequest,
  ApiFriend,
  ApiMessage,
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

  getById: (id: string) => request<ApiGameDetail>(`/api/games/${id}`),

  genres: () => request<ApiGenre[]>("/api/games/genres"),
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
};

// ── Purchase (adds to library + wishlist) ─────────────────────────────────────

export const purchaseApi = {
  buy: (gameId: string) =>
    request<void>(`/api/library/${gameId}`, { method: "POST" }),
};

// ── Friends ───────────────────────────────────────────────────────────────────

export const friendsApi = {
  list: () => request<ApiFriend[]>("/api/friends"),

  requests: () => request<ApiFriend[]>("/api/friends/requests"),

  search: (q: string) =>
    request<ApiFriend[]>(`/api/friends/search?q=${encodeURIComponent(q)}`),

  add: (userId: string) =>
    request<void>(`/api/friends/${userId}`, { method: "POST" }),

  accept: (requesterId: string) =>
    request<void>(`/api/friends/${requesterId}/accept`, { method: "PUT" }),

  remove: (friendId: string) =>
    request<void>(`/api/friends/${friendId}`, { method: "DELETE" }),
};

// ── Messages ──────────────────────────────────────────────────────────────────

export const messagesApi = {
  getConversation: (friendId: string, page = 1) =>
    request<ApiMessage[]>(`/api/messages/${friendId}?page=${page}&pageSize=50`),
  markRead: (friendId: string) =>
    request<void>(`/api/messages/${friendId}/read`, { method: "PUT" }),
};
