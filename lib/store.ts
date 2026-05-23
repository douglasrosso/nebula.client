"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ApiGame, ApiUser } from "./types";
import { authApi, usersApi, wishlistApi, libraryApi, purchaseApi } from "./api";

export type { ApiGame as Game };

interface StoreState {
  // ── Auth ────────────────────────────────────────────────────────────────────
  isHydrated: boolean;
  user: ApiUser | null;
  isLoggedIn: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadCurrentUser: () => Promise<void>;

  /** Redireciona para /login se não autenticado. Retorna true se já logado. */
  requireLogin: (action?: () => void) => boolean;

  // ── Games (cache) ─────────────────────────────────────────────────────────
  apiGames: ApiGame[];
  setApiGames: (games: ApiGame[]) => void;

  // ── Library ───────────────────────────────────────────────────────────────
  library: string[];
  loadLibrary: () => Promise<void>;
  addToLibrary: (gameId: string) => void;
  isInLibrary: (gameId: string) => boolean;

  // ── Wishlist ──────────────────────────────────────────────────────────────
  wishlist: string[];
  addToWishlist: (gameId: string) => Promise<void>;
  removeFromWishlist: (gameId: string) => Promise<void>;
  loadWishlist: () => Promise<void>;
  isInWishlist: (gameId: string) => boolean;

  // ── Purchase ──────────────────────────────────────────────────────────────
  purchase: (game: ApiGame) => Promise<void>;

  // ── Unread messages ───────────────────────────────────────────────────────
  unreadByFriend: Record<string, number>;
  incrementUnreadForFriend: (friendId: string) => void;
  markConversationRead: (friendId: string) => void;
  unreadFriendRequests: number;
  incrementFriendRequests: () => void;
  clearFriendRequests: () => void;

  // ── Filters ───────────────────────────────────────────────────────────────
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: "relevance" | "price-low" | "price-high" | "name" | "rating";
  setSortBy: (sort: "relevance" | "price-low" | "price-high" | "name" | "rating") => void;
  getFilteredGames: () => ApiGame[];
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ── Auth ─────────────────────────────────────────────────────────────────
      isHydrated: false,
      user: null,
      isLoggedIn: false,
      authLoading: false,

      login: async (email, password) => {
        set({ authLoading: true });
        try {
          await authApi.login({ email, password });
          const user = await usersApi.me();
          set({ user, isLoggedIn: true });
          await Promise.all([get().loadWishlist(), get().loadLibrary()]);
        } finally {
          set({ authLoading: false });
        }
      },

      logout: async () => {
        await authApi.logout().catch(() => {});
        set({ user: null, isLoggedIn: false, wishlist: [], library: [], unreadByFriend: {}, unreadFriendRequests: 0 });
        window.location.replace("/login");
      },

      loadCurrentUser: async () => {
        try {
          const user = await usersApi.me();
          set({ user, isLoggedIn: true });
        } catch {
          set({ user: null, isLoggedIn: false });
        }
      },

      requireLogin: (action) => {
        if (get().isLoggedIn) {
          action?.();
          return true;
        }
        window.location.href = "/login";
        return false;
      },

      // ── Games ─────────────────────────────────────────────────────────────────
      apiGames: [],
      setApiGames: (games) => set({ apiGames: games }),

      // ── Library ───────────────────────────────────────────────────────────────
      library: [],

      loadLibrary: async () => {
        if (!get().isLoggedIn) return;
        try {
          const items = await libraryApi.get();
          set({ library: items.map((i) => i.gameId) });
        } catch {}
      },

      addToLibrary: (gameId) =>
        set((s) => ({
          library: s.library.includes(gameId) ? s.library : [...s.library, gameId],
        })),

      isInLibrary: (gameId) => get().library.includes(gameId),

      // ── Wishlist ──────────────────────────────────────────────────────────────
      wishlist: [],

      loadWishlist: async () => {
        if (!get().isLoggedIn) return;
        try {
          const items = await wishlistApi.get();
          set({ wishlist: items.map((i) => i.gameId) });
        } catch {}
      },

      addToWishlist: async (gameId) => {
        set((s) => ({
          wishlist: s.wishlist.includes(gameId) ? s.wishlist : [...s.wishlist, gameId],
        }));
        if (get().isLoggedIn) {
          await wishlistApi.add(gameId).catch(() => {
            set((s) => ({ wishlist: s.wishlist.filter((id) => id !== gameId) }));
          });
        }
      },

      removeFromWishlist: async (gameId) => {
        set((s) => ({ wishlist: s.wishlist.filter((id) => id !== gameId) }));
        if (get().isLoggedIn) {
          await wishlistApi.remove(gameId).catch(() => {
            set((s) => ({ wishlist: s.wishlist.includes(gameId) ? s.wishlist : [...s.wishlist, gameId] }));
          });
        }
      },

      isInWishlist: (gameId) => get().wishlist.includes(gameId),

      // ── Purchase ──────────────────────────────────────────────────────────────
      purchase: async (game) => {
        await purchaseApi.buy(game.id);
        set((s) => ({
          library: s.library.includes(game.id) ? s.library : [...s.library, game.id],
        }));
      },

      // ── Unread messages ───────────────────────────────────────────────────────
      unreadByFriend: {},
      incrementUnreadForFriend: (friendId) =>
        set((s) => ({
          unreadByFriend: { ...s.unreadByFriend, [friendId]: (s.unreadByFriend[friendId] ?? 0) + 1 },
        })),
      markConversationRead: (friendId) =>
        set((s) => {
          const next = { ...s.unreadByFriend };
          delete next[friendId];
          return { unreadByFriend: next };
        }),
      unreadFriendRequests: 0,
      incrementFriendRequests: () => set((s) => ({ unreadFriendRequests: s.unreadFriendRequests + 1 })),
      clearFriendRequests: () => set({ unreadFriendRequests: 0 }),

      // ── Filters ───────────────────────────────────────────────────────────────
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedGenres: [],
      setSelectedGenres: (genres) => set({ selectedGenres: genres }),
      priceRange: [0, 500],
      setPriceRange: (range) => set({ priceRange: range }),
      sortBy: "relevance",
      setSortBy: (sort) => set({ sortBy: sort }),

      getFilteredGames: () => {
        const { apiGames, searchQuery, selectedGenres, priceRange, sortBy } = get();
        let filtered = apiGames.filter((game) => {
          const matchesSearch =
            searchQuery === "" ||
            game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
          const matchesGenres =
            selectedGenres.length === 0 ||
            selectedGenres.some((genre) => game.genres.includes(genre));
          const matchesPrice = game.price >= priceRange[0] && game.price <= priceRange[1];
          return matchesSearch && matchesGenres && matchesPrice;
        });
        switch (sortBy) {
          case "price-low": filtered.sort((a, b) => a.price - b.price); break;
          case "price-high": filtered.sort((a, b) => b.price - a.price); break;
          case "name": filtered.sort((a, b) => a.title.localeCompare(b.title)); break;
          case "rating": filtered.sort((a, b) => b.rating - a.rating); break;
        }
        return filtered;
      },
    }),
    {
      name: "nebula-store",
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        if (state) state.isHydrated = true;
      },
      partialize: (state) => ({
        library: state.library,
        wishlist: state.wishlist,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
