"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styled from "styled-components";
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

/* ─── Styled ─── */
const MainPage = styled.main`
  min-height: 100vh;
  padding-top: 5rem;
  padding-bottom: 4rem;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  @media (min-width: 1024px) { padding: 0 1.5rem; }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--foreground);
  margin: 0 0 0.25rem;
`;

const PageSubtitle = styled.p`
  font-size: 0.9375rem;
  color: var(--muted-foreground);
  margin: 0;
`;

const SearchRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const SearchForm = styled.form`
  flex: 1;
  position: relative;
`;

const SearchIconWrapper = styled.span`
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 2.75rem;
  padding-left: 2.5rem;
  padding-right: 1rem;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  color: var(--foreground);
  background-color: var(--surface-raised);
  border: 1px solid var(--border);
  outline: none;
  transition: border-color 150ms;
  &::placeholder { color: var(--text-tertiary); }
  &:focus { border-color: var(--ring); }
`;

const FilterButton = styled.button`
  height: 2.75rem;
  padding: 0 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  background-color: var(--surface-raised);
  border: 1px solid var(--border);
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 150ms;
  &:hover { color: var(--foreground); }
  @media (min-width: 1024px) { display: none; }
`;

const FilterDot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: var(--primary);
  position: absolute;
  top: -0.125rem;
  right: -0.125rem;
`;

const ActiveFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FilterTag = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 500;
  background-color: color-mix(in oklch, var(--primary) 12%, transparent);
  color: var(--primary);
  border: none;
  cursor: pointer;
`;

const ContentRow = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const Sidebar = styled.aside`
  display: none;
  width: 14rem;
  flex-shrink: 0;
  @media (min-width: 1024px) { display: block; }
`;

const SidebarInner = styled.div`
  border-radius: 1rem;
  padding: 1.25rem;
  position: sticky;
  top: 5rem;
  background-color: var(--surface-base);
`;

const SidebarTitle = styled.p`
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 1.25rem;
`;

const Main = styled.div`
  flex: 1;
`;

const ResultCount = styled.div`
  margin-bottom: 1rem;
  font-size: 0.8125rem;
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EmptyState = styled.div`
  border-radius: 1rem;
  padding: 3rem;
  text-align: center;
  background-color: var(--surface-raised);
`;

const EmptyText = styled.p`
  font-size: 0.9375rem;
  color: var(--muted-foreground);
  margin: 0 0 1rem;
`;

const ClearButton = styled.button`
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: var(--surface-inset);
  color: var(--foreground);
  border: none;
  cursor: pointer;
  transition: opacity 150ms;
  &:hover { opacity: 0.8; }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  @media (min-width: 640px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1280px) { grid-template-columns: repeat(3, 1fr); }
`;

/* ─── Filters Panel ─── */
const FiltersSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const FilterGroupLabel = styled.p`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.75rem;
  color: var(--muted-foreground);
`;

const SortList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const SortOption = styled.button<{ $active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 150ms;
  border: none;
  cursor: pointer;
  background-color: ${({ $active }) => $active ? "color-mix(in oklch, var(--primary) 12%, transparent)" : "transparent"};
  color: ${({ $active }) => $active ? "var(--primary)" : "var(--muted-foreground)"};
  &:hover {
    color: ${({ $active }) => $active ? "var(--primary)" : "var(--foreground)"};
    background-color: ${({ $active }) => $active ? "color-mix(in oklch, var(--primary) 12%, transparent)" : "color-mix(in oklch, var(--foreground) 5%, transparent)"};
  }
`;

const SortDot = styled.span`
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 9999px;
  background-color: var(--primary);
`;

const PriceRange = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8125rem;
  color: var(--muted-foreground);
  margin-top: 0.75rem;
`;

const GenresList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const GenreChip = styled.button<{ $active?: boolean }>`
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 150ms;
  border: none;
  cursor: pointer;
  background-color: ${({ $active }) => $active ? "var(--primary)" : "var(--surface-inset)"};
  color: ${({ $active }) => $active ? "var(--primary-foreground)" : "var(--foreground)"};
  &:hover {
    background-color: ${({ $active }) => $active ? "var(--primary)" : "color-mix(in oklch, var(--primary) 12%, transparent)"};
    color: ${({ $active }) => $active ? "var(--primary-foreground)" : "var(--primary)"};
  }
`;

const ClearFiltersButton = styled.button`
  width: 100%;
  padding: 0.625rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: var(--surface-inset);
  color: var(--destructive);
  border: none;
  cursor: pointer;
  transition: opacity 150ms;
  &:hover { opacity: 0.8; }
`;

const LoadingSpinner = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

/* ─── FiltersContent — extracted to prevent remount on every render ─── */
type SortValue = typeof SORT_OPTIONS[number]["value"];

interface FiltersContentProps {
  sortBy: SortValue;
  setSortBy: (v: SortValue) => void;
  localPriceRange: [number, number];
  onSliderChange: (v: [number, number]) => void;
  committedPriceRange: [number, number];
  apiGenres: string[];
  selectedGenres: string[];
  toggleGenre: (g: string) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
}

function FiltersContent({
  sortBy, setSortBy,
  localPriceRange, onSliderChange, committedPriceRange,
  apiGenres, selectedGenres, toggleGenre,
  hasActiveFilters, clearFilters,
}: FiltersContentProps) {
  return (
    <FiltersSection>
      <div>
        <FilterGroupLabel>Ordenar</FilterGroupLabel>
        <SortList>
          {SORT_OPTIONS.map((opt) => (
            <SortOption
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              $active={sortBy === opt.value}
            >
              {opt.label}
              {sortBy === opt.value && <SortDot />}
            </SortOption>
          ))}
        </SortList>
      </div>

      <div>
        <FilterGroupLabel>Faixa de Preço</FilterGroupLabel>
        <Slider
          value={localPriceRange}
          onValueChange={(v) => onSliderChange(v as [number, number])}
          max={500}
          step={10}
          style={{ marginBottom: "0.75rem" }}
        />
        <PriceRange>
          <span>R$ {localPriceRange[0]}</span>
          <span>R$ {localPriceRange[1]}</span>
        </PriceRange>
      </div>

      <div>
        <FilterGroupLabel>Gêneros</FilterGroupLabel>
        <GenresList>
          {apiGenres.map((genre) => (
            <GenreChip
              key={genre}
              onClick={() => toggleGenre(genre)}
              $active={selectedGenres.includes(genre)}
            >
              {genre}
            </GenreChip>
          ))}
        </GenresList>
      </div>

      {hasActiveFilters && (
        <ClearFiltersButton onClick={clearFilters}>Limpar filtros</ClearFiltersButton>
      )}
    </FiltersSection>
  );
}

/* ─── Store Content ─── */
function StoreContent() {
  const searchParams = useSearchParams();
  const {
    searchQuery, setSearchQuery,
    selectedGenres, setSelectedGenres,
    priceRange, setPriceRange,
    sortBy, setSortBy,
    getFilteredGames,
  } = useStore();

  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);
  const [apiGenres, setApiGenres] = useState<string[]>(DEFAULT_GENRES);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { loading } = useGames({ pageSize: 200 });
  const filteredGames = getFilteredGames();

  // Sync local slider when store resets (e.g. clearFilters)
  useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange[0], priceRange[1]]);

  useEffect(() => {
    const genre = searchParams.get("genre");
    if (genre && !selectedGenres.includes(genre)) setSelectedGenres([genre]);
  }, []);

  useEffect(() => {
    gamesApi.genres().then((gs) => { if (gs.length > 0) setApiGenres(gs.map((g) => g.name)); }).catch(() => {});
  }, []);

  const handleSliderChange = (v: [number, number]) => {
    setLocalPriceRange(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setPriceRange(v), 300);
  };

  const handleSearch = (e: React.SyntheticEvent<HTMLFormElement>) => { e.preventDefault(); setSearchQuery(localSearch); };
  const toggleGenre = (genre: string) => setSelectedGenres(selectedGenres.includes(genre) ? selectedGenres.filter((g) => g !== genre) : [...selectedGenres, genre]);
  const clearFilters = () => {
    setSearchQuery("");
    setLocalSearch("");
    setSelectedGenres([]);
    setPriceRange([0, 500]);
    setSortBy("relevance");
  };
  const hasActiveFilters = searchQuery !== "" || selectedGenres.length > 0 || priceRange[0] > 0 || priceRange[1] < 500;

  const filtersProps: FiltersContentProps = {
    sortBy: sortBy as SortValue,
    setSortBy: setSortBy as (v: SortValue) => void,
    localPriceRange,
    onSliderChange: handleSliderChange,
    committedPriceRange: priceRange,
    apiGenres,
    selectedGenres,
    toggleGenre,
    hasActiveFilters,
    clearFilters,
  };

  return (
    <MainPage id="main-content">
      <Container>
        <PageHeader>
          <PageTitle>Loja</PageTitle>
          <PageSubtitle>Descubra sua próxima aventura</PageSubtitle>
        </PageHeader>

        <SearchRow>
          <SearchForm onSubmit={handleSearch}>
            <SearchIconWrapper>
              <Search style={{ width: "1rem", height: "1rem" }} />
            </SearchIconWrapper>
            <SearchInput
              type="search" placeholder="Pesquisar jogos..."
              value={localSearch} onChange={(e) => setLocalSearch(e.target.value)}
              aria-label="Pesquisar jogos"
            />
          </SearchForm>

          <Sheet>
            <SheetTrigger asChild>
              <FilterButton aria-label="Abrir filtros">
                <SlidersHorizontal style={{ width: "1rem", height: "1rem" }} />
                Filtros
                {hasActiveFilters && <FilterDot />}
              </FilterButton>
            </SheetTrigger>
            <SheetContent side="right" style={{ width: "20rem", backgroundColor: "var(--background)", padding: "1.5rem" }}>
              <SheetHeader>
                <SheetTitle style={{ fontSize: "1.0625rem", fontWeight: 700, color: "var(--foreground)" }}>Filtros</SheetTitle>
              </SheetHeader>
              <div style={{ marginTop: "1.5rem" }}>
                <FiltersContent {...filtersProps} />
              </div>
            </SheetContent>
          </Sheet>
        </SearchRow>

        {hasActiveFilters && (
          <ActiveFilters>
            {searchQuery && (
              <FilterTag onClick={() => { setSearchQuery(""); setLocalSearch(""); }}>
                "{searchQuery}" <X style={{ width: "0.75rem", height: "0.75rem" }} />
              </FilterTag>
            )}
            {selectedGenres.map((genre) => (
              <FilterTag key={genre} onClick={() => toggleGenre(genre)}>
                {genre} <X style={{ width: "0.75rem", height: "0.75rem" }} />
              </FilterTag>
            ))}
          </ActiveFilters>
        )}

        <ContentRow>
          <Sidebar>
            <SidebarInner>
              <SidebarTitle>Filtros</SidebarTitle>
              <FiltersContent {...filtersProps} />
            </SidebarInner>
          </Sidebar>

          <Main>
            <ResultCount>
              {loading
                ? <LoadingSpinner><Loader2 style={{ width: "0.875rem", height: "0.875rem", animation: "spin 1s linear infinite" }} /> Carregando...</LoadingSpinner>
                : `${filteredGames.length} jogo${filteredGames.length !== 1 ? "s" : ""}`
              }
            </ResultCount>
            {!loading && filteredGames.length === 0 ? (
              <EmptyState>
                <EmptyText>Nenhum jogo encontrado com os filtros selecionados.</EmptyText>
                <ClearButton onClick={clearFilters}>Limpar filtros</ClearButton>
              </EmptyState>
            ) : (
              <GamesGrid>
                {filteredGames.map((game) => <GameCard key={game.id} game={game} />)}
              </GamesGrid>
            )}
          </Main>
        </ContentRow>
      </Container>
    </MainPage>
  );
}

const FallbackMain = styled.main`
  min-height: 100vh;
  padding-top: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function StorePage() {
  return (
    <Suspense fallback={<FallbackMain><Loader2 style={{ width: "2rem", height: "2rem", animation: "spin 1s linear infinite", color: "var(--primary)" }} /></FallbackMain>}>
      <StoreContent />
    </Suspense>
  );
}
