"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { GameCard } from "@/components/game-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Search, SlidersHorizontal, X } from "lucide-react";

const allGenres = [
  "Ação",
  "RPG",
  "Aventura",
  "Mundo Aberto",
  "FPS",
  "Terror",
  "Estratégia",
  "Corrida",
  "Simulador",
  "Sandbox",
  "Indie",
  "Esportes",
];

export default function StorePage() {
  const {
    searchQuery,
    setSearchQuery,
    selectedGenres,
    setSelectedGenres,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    getFilteredGames,
  } = useStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const filteredGames = getFilteredGames();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
  };

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocalSearch("");
    setSelectedGenres([]);
    setPriceRange([0, 500]);
    setSortBy("relevance");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedGenres.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 500;

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-4">Faixa de Preço</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            max={500}
            step={10}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>R$ {priceRange[0]}</span>
            <span>R$ {priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Genres */}
      <div>
        <h3 className="font-semibold mb-4">Gêneros</h3>
        <div className="space-y-3">
          {allGenres.map((genre) => (
            <label
              key={genre}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Checkbox
                checked={selectedGenres.includes(genre)}
                onCheckedChange={() => toggleGenre(genre)}
                id={`genre-${genre}`}
              />
              <span className="text-sm">{genre}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full gap-2"
        >
          <X className="w-4 h-4" />
          Limpar filtros
        </Button>
      )}
    </div>
  );

  return (
    <main id="main-content" className="min-h-screen pt-20 lg:pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Loja</h1>
          <p className="text-muted-foreground">
            Descubra sua próxima aventura entre centenas de jogos
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar jogos..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-12 h-12 bg-secondary/50 border-glass-border rounded-xl"
              aria-label="Pesquisar jogos"
            />
          </form>

          <div className="flex gap-3">
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as typeof sortBy)}
            >
              <SelectTrigger className="w-48 h-12 bg-secondary/50 border-glass-border rounded-xl">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="price-low">Menor preço</SelectItem>
                <SelectItem value="price-high">Maior preço</SelectItem>
                <SelectItem value="name">Nome A-Z</SelectItem>
                <SelectItem value="rating">Melhor avaliação</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl relative"
                  aria-label="Abrir filtros"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  {hasActiveFilters && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass w-80">
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchQuery && (
              <Badge
                variant="secondary"
                className="gap-2 px-3 py-1.5 cursor-pointer"
                onClick={() => {
                  setSearchQuery("");
                  setLocalSearch("");
                }}
              >
                Busca: {searchQuery}
                <X className="w-3 h-3" />
              </Badge>
            )}
            {selectedGenres.map((genre) => (
              <Badge
                key={genre}
                variant="secondary"
                className="gap-2 px-3 py-1.5 cursor-pointer"
                onClick={() => toggleGenre(genre)}
              >
                {genre}
                <X className="w-3 h-3" />
              </Badge>
            ))}
            {(priceRange[0] > 0 || priceRange[1] < 500) && (
              <Badge
                variant="secondary"
                className="gap-2 px-3 py-1.5 cursor-pointer"
                onClick={() => setPriceRange([0, 500])}
              >
                R$ {priceRange[0]} - R$ {priceRange[1]}
                <X className="w-3 h-3" />
              </Badge>
            )}
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="glass rounded-2xl p-6 sticky top-28">
              <h2 className="font-bold text-lg mb-6">Filtros</h2>
              <FiltersContent />
            </div>
          </aside>

          {/* Games Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                {filteredGames.length} jogos encontrados
              </p>
            </div>

            {filteredGames.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Nenhum jogo encontrado com os filtros selecionados.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
