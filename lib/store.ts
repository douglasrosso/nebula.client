"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ApiGame, ApiUser, ApiReview } from "./types";
import { authApi, usersApi, cartApi, wishlistApi, libraryApi, ordersApi } from "./api";

export type { ApiGame as Game };

export interface Review {
  id: string;
  gameId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: "positive" | "negative";
  hoursPlayed: number;
  content: string;
  date: string;
  helpful: number;
  funny: number;
}

interface CartItem {
  game: ApiGame;
  quantity: number;
}

interface StoreState {
  // ── Auth ────────────────────────────────────────────────────────────────────
  user: ApiUser | null;
  isLoggedIn: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadCurrentUser: () => Promise<void>;
  updateProfile: (data: Partial<ApiUser>) => Promise<void>;

  /** Redireciona para /login se não autenticado. Retorna true se já logado. */
  requireLogin: (action?: () => void) => boolean;

  // ── Games (cache) ─────────────────────────────────────────────────────────
  apiGames: ApiGame[];
  setApiGames: (games: ApiGame[]) => void;

  // ── Cart ──────────────────────────────────────────────────────────────────
  cart: CartItem[];
  addToCart: (game: ApiGame) => Promise<void>;
  removeFromCart: (gameId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;

  // ── Library ───────────────────────────────────────────────────────────────
  library: string[];
  loadLibrary: () => Promise<void>;
  addToLibrary: (gameId: string) => void;
  removeFromLibrary: (gameId: string) => void;
  isInLibrary: (gameId: string) => boolean;

  // ── Wishlist ──────────────────────────────────────────────────────────────
  wishlist: string[];
  addToWishlist: (gameId: string) => Promise<void>;
  removeFromWishlist: (gameId: string) => Promise<void>;
  loadWishlist: () => Promise<void>;
  isInWishlist: (gameId: string) => boolean;

  // ── Reviews ───────────────────────────────────────────────────────────────
  reviews: Review[];
  addReview: (review: Review) => void;
  getGameReviews: (gameId: string) => Review[];

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
      user: null,
      isLoggedIn: false,
      authLoading: false,

      login: async (email, password) => {
        set({ authLoading: true });
        try {
          await authApi.login({ email, password });
          const user = await usersApi.me();
          set({ user, isLoggedIn: true });
          await Promise.all([get().loadCart(), get().loadWishlist(), get().loadLibrary()]);
        } finally {
          set({ authLoading: false });
        }
      },

      logout: async () => {
        await authApi.logout().catch(() => {});
        set({ user: null, isLoggedIn: false, cart: [], wishlist: [], library: [] });
      },

      loadCurrentUser: async () => {
        try {
          const user = await usersApi.me();
          set({ user, isLoggedIn: true });
        } catch {
          set({ user: null, isLoggedIn: false });
        }
      },

      updateProfile: async (data) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, ...data } });
        try {
          const updated = await usersApi.update(user.id, data);
          set({ user: updated });
        } catch {
          set({ user });
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

      // ── Cart ──────────────────────────────────────────────────────────────────
      cart: [],

      loadCart: async () => {
        if (!get().isLoggedIn) return;
        try {
          const items = await cartApi.get();
          const cartItems: CartItem[] = items.map((item) => ({
            quantity: 1,
            game: {
              id: item.gameId,
              title: item.title,
              coverImage: item.coverImage,
              price: item.price,
              originalPrice: item.originalPrice,
              discount: item.discount,
              description: "",
              longDescription: "",
              screenshots: [],
              developer: "",
              publisher: "",
              releaseDate: "",
              genres: [],
              tags: [],
              rating: 0,
              reviewCount: 0,
              positivePercentage: 0,
              features: [],
              systemRequirements: {
                minimum: { os: "", processor: "", memory: "", graphics: "", storage: "" },
                recommended: { os: "", processor: "", memory: "", graphics: "", storage: "" },
              },
            },
          }));
          set({ cart: cartItems });
        } catch {}
      },

      addToCart: async (game) => {
        const state = get();
        if (state.cart.some((i) => i.game.id === game.id)) return;
        set((s) => ({ cart: [...s.cart, { game, quantity: 1 }] }));
        if (state.isLoggedIn) {
          await cartApi.add(game.id).catch(() => {
            set((s) => ({ cart: s.cart.filter((i) => i.game.id !== game.id) }));
          });
        }
      },

      removeFromCart: async (gameId) => {
        const prev = get().cart;
        set((s) => ({ cart: s.cart.filter((i) => i.game.id !== gameId) }));
        if (get().isLoggedIn) {
          await cartApi.remove(gameId).catch(() => set({ cart: prev }));
        }
      },

      clearCart: async () => {
        const prev = get().cart;
        set({ cart: [] });
        if (get().isLoggedIn) {
          await cartApi.clear().catch(() => set({ cart: prev }));
        }
      },

      getCartTotal: () => get().cart.reduce((t, i) => t + i.game.price, 0),
      getCartCount: () => get().cart.length,

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

      removeFromLibrary: (gameId) =>
        set((s) => ({ library: s.library.filter((id) => id !== gameId) })),

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
          await wishlistApi.remove(gameId).catch(() => {});
        }
      },

      isInWishlist: (gameId) => get().wishlist.includes(gameId),

      // ── Reviews ───────────────────────────────────────────────────────────────
      reviews: [],
      addReview: (review) => set((s) => ({ reviews: [review, ...s.reviews] })),
      getGameReviews: (gameId) => get().reviews.filter((r) => r.gameId === gameId),

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
      partialize: (state) => ({
        cart: state.cart,
        library: state.library,
        wishlist: state.wishlist,
        reviews: state.reviews,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
