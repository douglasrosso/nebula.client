"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { useGames } from "@/lib/hooks/useGames";
import { GameCard } from "@/components/game-card";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { gamesApi } from "@/lib/api";

const DEFAULT_GENRES = [
  "Ação", "RPG", "Aventura", "Mundo Aberto", "FPS", "Terror",
  "Estratégia", "Corrida", "Simulador", "Sandbox", "Indie", "Esportes",
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevância" },
  { value: "price-low", label: "Menor preço" },
  { value: "price-high", label: "Maior preço" },
  { value: "name", label: "Nome A-Z" },
  { value: "rating", label: "Melhor avaliação" },
] as const;

function StoreContent() {
  const searchParams = useSearchParams();
  const { searchQuery, setSearchQuery, selectedGenres, setSelectedGenres, priceRange, setPriceRange, sortBy, setSortBy, getFilteredGames } = useStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [apiGenres, setApiGenres] = useState<string[]>(DEFAULT_GENRES);
  const { loading } = useGames({ pageSize: 200 });
  const filteredGames = getFilteredGames();

  useEffect(() => {
    const genre = searchParams.get("genre");
    if (genre && !selectedGenres.includes(genre)) setSelectedGenres([genre]);
  }, []);

  useEffect(() => {
    gamesApi.genres().then((gs) => { if (gs.length > 0) setApiGenres(gs.map((g) => g.name)); }).catch(() => {});
  }, []);

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => { e.preventDefault(); setSearchQuery(localSearch); };
  const toggleGenre = (genre: string) => setSelectedGenres(selectedGenres.includes(genre) ? selectedGenres.filter((g) => g !== genre) : [...selectedGenres, genre]);
  const clearFilters = () => { setSearchQuery(""); setLocalSearch(""); setSelectedGenres([]); setPriceRange([0, 500]); setSortBy("relevance"); };
  const hasActiveFilters = searchQuery !== "" || selectedGenres.length > 0 || priceRange[0] > 0 || priceRange[1] < 500;

  const FiltersContent = () => (
    <div className="space-y-7">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-3 text-muted-foreground">Ordenar</p>
        <div className="space-y-0.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value as typeof sortBy)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[14px] transition-colors ${sortBy === opt.value ? "bg-primary/12 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"}`}
            >
              {opt.label}
              {sortBy === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-3 text-muted-foreground">Faixa de Preço</p>
        <Slider value={priceRange} onValueChange={(v) => setPriceRange(v as [number, number])} max={500} step={10} className="mb-3" />
        <div className="flex items-center justify-between text-[13px] text-muted-foreground">
          <span>R$ {priceRange[0]}</span><span>R$ {priceRange[1]}</span>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider mb-3 text-muted-foreground">Gêneros</p>
        <div className="flex flex-wrap gap-2">
          {apiGenres.map((genre) => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors ${selectedGenres.includes(genre) ? "bg-primary text-primary-foreground" : "bg-surface-inset text-foreground hover:bg-primary/12 hover:text-primary"}`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full py-2.5 rounded-xl text-[14px] font-medium bg-surface-inset text-destructive hover:opacity-80 transition-opacity"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );

  return (
    <main id="main-content" className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold tracking-tight text-foreground mb-1">Loja</h1>
          <p className="text-[15px] text-muted-foreground">Descubra sua próxima aventura</p>
        </div>

        <div className="flex gap-2 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search" placeholder="Pesquisar jogos..."
              value={localSearch} onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl text-[15px] text-foreground bg-surface-raised border border-border outline-none transition-colors placeholder:text-text-tertiary"
              aria-label="Pesquisar jogos"
            />
          </form>

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <button
                className="h-11 px-4 rounded-xl text-[14px] font-medium flex items-center gap-2 relative bg-surface-raised border border-border text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Abrir filtros"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
                {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary absolute -top-0.5 -right-0.5" />}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background border-border p-6">
              <SheetHeader>
                <SheetTitle className="text-[17px] font-bold text-foreground">Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-6"><FiltersContent /></div>
            </SheetContent>
          </Sheet>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setLocalSearch(""); }} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium bg-primary/12 text-primary">
                "{searchQuery}" <X className="w-3 h-3" />
              </button>
            )}
            {selectedGenres.map((genre) => (
              <button key={genre} onClick={() => toggleGenre(genre)} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium bg-primary/12 text-primary">
                {genre} <X className="w-3 h-3" />
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-6">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="rounded-2xl p-5 sticky top-20 bg-surface-base">
              <p className="text-[17px] font-bold text-foreground mb-5">Filtros</p>
              <FiltersContent />
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-4 text-[13px] text-muted-foreground">
              {loading
                ? <span className="flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Carregando...</span>
                : `${filteredGames.length} jogo${filteredGames.length !== 1 ? "s" : ""}`
              }
            </div>
            {!loading && filteredGames.length === 0 ? (
              <div className="rounded-2xl p-12 text-center bg-surface-raised">
                <p className="text-[15px] text-muted-foreground mb-4">Nenhum jogo encontrado com os filtros selecionados.</p>
                <button onClick={clearFilters} className="px-5 py-2 rounded-xl text-[14px] font-semibold bg-surface-inset text-foreground hover:opacity-80 transition-opacity">
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredGames.map((game) => <GameCard key={game.id} game={game} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={<main className="min-h-screen pt-20 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></main>}>
      <StoreContent />
    </Suspense>
  );
}
