"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { games, type Game, type Review } from "./games-data";

interface CartItem {
  game: Game;
  quantity: number;
}

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  level: number;
  xp: number;
  joinDate: string;
  country: string;
  bio: string;
  friendCount: number;
  gamesOwned: number;
  badges: string[];
}

interface StoreState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;

  cart: CartItem[];
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  library: string[];
  addToLibrary: (gameId: string) => void;
  removeFromLibrary: (gameId: string) => void;
  isInLibrary: (gameId: string) => boolean;

  wishlist: string[];
  addToWishlist: (gameId: string) => void;
  removeFromWishlist: (gameId: string) => void;
  isInWishlist: (gameId: string) => boolean;

  reviews: Review[];
  addReview: (review: Review) => void;
  getGameReviews: (gameId: string) => Review[];

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: "relevance" | "price-low" | "price-high" | "name" | "rating";
  setSortBy: (sort: "relevance" | "price-low" | "price-high" | "name" | "rating") => void;

  getFilteredGames: () => Game[];
}

const defaultUser: User = {
  id: "1",
  username: "gamer123",
  displayName: "Jogador Pro",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gamer123",
  level: 42,
  xp: 8500,
  joinDate: "15 de março de 2020",
  country: "Brasil",
  bio: "Apaixonado por RPGs e jogos de mundo aberto. Sempre em busca da próxima aventura épica!",
  friendCount: 156,
  gamesOwned: 87,
  badges: ["Colecionador", "Veterano", "Revisor Expert", "Jogador Social"],
};

const defaultReviews: Review[] = [
  {
    id: "r1",
    gameId: "1",
    userId: "u1",
    userName: "DragonSlayer99",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dragon",
    rating: "positive",
    hoursPlayed: 245,
    content: "Simplesmente uma obra-prima. O mundo aberto é vasto e cheio de segredos. A dificuldade é desafiadora mas justa. Recomendo fortemente para fãs de RPG.",
    date: "12 de janeiro de 2024",
    helpful: 234,
    funny: 12,
  },
  {
    id: "r2",
    gameId: "1",
    userId: "u2",
    userName: "CasualGamer",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=casual",
    rating: "positive",
    hoursPlayed: 89,
    content: "Comecei achando difícil demais, mas depois que peguei o jeito, não consegui parar. A exploração é viciante!",
    date: "5 de fevereiro de 2024",
    helpful: 156,
    funny: 8,
  },
  {
    id: "r3",
    gameId: "1",
    userId: "u3",
    userName: "SoulsVeteran",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=souls",
    rating: "positive",
    hoursPlayed: 512,
    content: "O melhor jogo da FromSoftware até agora. A parceria com George R.R. Martin resultou em um mundo incrível. 10/10",
    date: "28 de dezembro de 2023",
    helpful: 445,
    funny: 23,
  },
  {
    id: "r4",
    gameId: "2",
    userId: "u4",
    userName: "CyberRunner",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cyber",
    rating: "positive",
    hoursPlayed: 178,
    content: "Depois das atualizações, o jogo está incrível. Night City é uma das cidades mais impressionantes que já vi em um game.",
    date: "15 de janeiro de 2024",
    helpful: 312,
    funny: 15,
  },
  {
    id: "r5",
    gameId: "3",
    userId: "u5",
    userName: "WesternFan",
    userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=western",
    rating: "positive",
    hoursPlayed: 320,
    content: "A melhor história que já joguei. Arthur Morgan é um dos protagonistas mais bem escritos da história dos games.",
    date: "20 de novembro de 2023",
    helpful: 567,
    funny: 34,
  },
];

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      isLoggedIn: true,
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false }),
      updateProfile: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),

      cart: [],
      addToCart: (game) =>
        set((state) => {
          const existing = state.cart.find((item) => item.game.id === game.id);
          if (existing) return state;
          return { cart: [...state.cart, { game, quantity: 1 }] };
        }),
      removeFromCart: (gameId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.game.id !== gameId),
        })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.game.price, 0);
      },
      getCartCount: () => {
        const { cart } = get();
        return cart.length;
      },

      library: ["9", "12"],
      addToLibrary: (gameId) =>
        set((state) => ({
          library: state.library.includes(gameId)
            ? state.library
            : [...state.library, gameId],
        })),
      removeFromLibrary: (gameId) =>
        set((state) => ({
          library: state.library.filter((id) => id !== gameId),
        })),
      isInLibrary: (gameId) => get().library.includes(gameId),

      wishlist: ["1", "7"],
      addToWishlist: (gameId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(gameId)
            ? state.wishlist
            : [...state.wishlist, gameId],
        })),
      removeFromWishlist: (gameId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((id) => id !== gameId),
        })),
      isInWishlist: (gameId) => get().wishlist.includes(gameId),

      reviews: defaultReviews,
      addReview: (review) =>
        set((state) => ({ reviews: [review, ...state.reviews] })),
      getGameReviews: (gameId) =>
        get().reviews.filter((r) => r.gameId === gameId),

      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedGenres: [],
      setSelectedGenres: (genres) => set({ selectedGenres: genres }),
      priceRange: [0, 500],
      setPriceRange: (range) => set({ priceRange: range }),
      sortBy: "relevance",
      setSortBy: (sort) => set({ sortBy: sort }),

      getFilteredGames: () => {
        const { searchQuery, selectedGenres, priceRange, sortBy } = get();

        let filtered = games.filter((game) => {
          const matchesSearch =
            searchQuery === "" ||
            game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            game.genres.some((g) =>
              g.toLowerCase().includes(searchQuery.toLowerCase())
            );

          const matchesGenres =
            selectedGenres.length === 0 ||
            selectedGenres.some((genre) => game.genres.includes(genre));

          const matchesPrice =
            game.price >= priceRange[0] && game.price <= priceRange[1];

          return matchesSearch && matchesGenres && matchesPrice;
        });

        switch (sortBy) {
          case "price-low":
            filtered.sort((a, b) => a.price - b.price);
            break;
          case "price-high":
            filtered.sort((a, b) => b.price - a.price);
            break;
          case "name":
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case "rating":
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          default:
            break;
        }

        return filtered;
      },
    }),
    {
      name: "Nebula-store",
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
