"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useGames } from "@/lib/hooks/useGames";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Library, Search, Play, Clock, Grid3X3, List, SortAsc } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AuthGuard } from "@/components/auth-guard";

export default function LibraryPage() {
  const { library, wishlist, apiGames } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");

  // Ensure games are loaded
  useGames({ pageSize: 200 });

  const libraryGames = apiGames.filter((g) => library.includes(g.id));
  const wishlistGames = apiGames.filter((g) => wishlist.includes(g.id));

  const filteredLibrary = libraryGames
    .filter(
      (game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return 0;
    });

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratuito";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
  };

  return (
    <AuthGuard title="Minha Biblioteca" description="Faça login para acessar sua biblioteca de jogos.">
    <main id="main-content" className="min-h-screen pt-20 lg:pt-24 pb-12">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="library" className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Minha Biblioteca</h1>
              <p className="text-muted-foreground">{libraryGames.length} jogos na sua biblioteca</p>
            </div>
            <TabsList className="glass">
              <TabsTrigger value="library" className="gap-2">
                <Library className="w-4 h-4" /> Biblioteca ({libraryGames.length})
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="gap-2">
                Lista de Desejos ({wishlistGames.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="library" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Pesquisar na biblioteca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-secondary/50 border-glass-border rounded-xl"
                  aria-label="Pesquisar jogos na biblioteca"
                />
              </div>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44 h-12 bg-secondary/50 border-glass-border rounded-xl">
                    <SortAsc className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nome A-Z</SelectItem>
                    <SelectItem value="recent">Recentes</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border border-glass-border rounded-xl overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="rounded-none h-12 w-12"
                    aria-label="Visualização em grade"
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="rounded-none h-12 w-12"
                    aria-label="Visualização em lista"
                  >
                    <List className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {filteredLibrary.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                  <Library className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  {library.length === 0 ? "Sua biblioteca está vazia" : "Nenhum jogo encontrado"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {library.length === 0 ? "Compre jogos na loja para adicioná-los à sua biblioteca." : "Tente uma busca diferente."}
                </p>
                {library.length === 0 && (
                  <Link href="/loja"><Button>Explorar loja</Button></Link>
                )}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredLibrary.map((game) => (
                  <Link
                    key={game.id}
                    href={`/jogo/${game.id}`}
                    className="group relative overflow-hidden rounded-2xl glass transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[460/215]">
                      <Image
                        src={game.coverImage}
                        alt={game.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button size="sm" className="gap-2">
                          <Play className="w-4 h-4" /> Jogar
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                        {game.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{game.genres.slice(0, 2).join(", ")}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredLibrary.map((game) => (
                  <Link
                    key={game.id}
                    href={`/jogo/${game.id}`}
                    className="group flex items-center gap-4 p-4 glass rounded-xl hover:bg-glass-hover transition-all"
                  >
                    <div className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={game.coverImage} alt={game.title} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{game.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{game.genres.slice(0, 2).join(", ")}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 0h jogadas
                        </span>
                      </div>
                    </div>
                    <Button size="sm" className="gap-2">
                      <Play className="w-4 h-4" /> Jogar
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-6">
            {wishlistGames.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <h2 className="text-xl font-semibold mb-2">Sua lista de desejos está vazia</h2>
                <p className="text-muted-foreground mb-6">Adicione jogos à lista de desejos para acompanhar promoções.</p>
                <Link href="/loja"><Button>Explorar loja</Button></Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistGames.map((game) => (
                  <Link
                    key={game.id}
                    href={`/jogo/${game.id}`}
                    className="group flex gap-4 p-4 glass rounded-2xl hover:bg-glass-hover transition-all"
                  >
                    <div className="relative w-28 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={game.coverImage} alt={game.title} fill className="object-cover" sizes="112px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{game.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {game.discount && (
                          <Badge className="bg-success/20 text-success text-xs">-{game.discount}%</Badge>
                        )}
                        <span className="text-sm font-medium text-primary">{formatPrice(game.price)}</span>
                        {game.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">{formatPrice(game.originalPrice)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
    </AuthGuard>
  );
}
