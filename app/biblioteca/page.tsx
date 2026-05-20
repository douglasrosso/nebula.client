"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useGames } from "@/lib/hooks/useGames";
import { AuthGuard } from "@/components/auth-guard";
import { Library, Search, Play, Grid3X3, List } from "lucide-react";

function formatPrice(price: number) {
  if (price === 0) return "Gratuito";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
}

export default function LibraryPage() {
  const { library, wishlist, apiGames } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useGames({ pageSize: 200 });

  const libraryGames = apiGames
    .filter((g) => library.includes(g.id))
    .filter((g) => g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.genres.some((genre) => genre.toLowerCase().includes(searchQuery.toLowerCase())))
    .sort((a, b) => a.title.localeCompare(b.title));

  const wishlistGames = apiGames.filter((g) => wishlist.includes(g.id));

  return (
    <AuthGuard>
      <main id="main-content" className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[28px] font-bold tracking-tight text-foreground">Biblioteca</h1>
              <p className="text-[15px] mt-0.5 text-muted-foreground">
                {library.length} {library.length === 1 ? "jogo" : "jogos"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-primary/15 text-primary" : "bg-surface-raised text-muted-foreground"}`}
                aria-label="Visualização em grade"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-primary/15 text-primary" : "bg-surface-raised text-muted-foreground"}`}
                aria-label="Visualização em lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Pesquisar na biblioteca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 h-10 pl-10 pr-4 rounded-xl text-[15px] text-foreground bg-surface-raised outline-none placeholder:text-text-tertiary"
            />
          </div>

          {libraryGames.length === 0 ? (
            <div className="rounded-2xl p-16 text-center bg-surface-base">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-surface-inset">
                <Library className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-[17px] font-semibold text-foreground mb-1">
                {library.length === 0 ? "Biblioteca vazia" : "Nenhum jogo encontrado"}
              </p>
              <p className="text-[15px] mb-6 text-muted-foreground">
                {library.length === 0 ? "Compre jogos na loja para adicioná-los aqui." : "Tente uma busca diferente."}
              </p>
              {library.length === 0 && (
                <Link
                  href="/loja"
                  className="inline-flex px-5 py-2.5 rounded-xl text-[15px] font-semibold text-primary-foreground bg-primary transition-opacity hover:opacity-80"
                >
                  Explorar loja
                </Link>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {libraryGames.map((game) => (
                <Link
                  key={game.id}
                  href={`/jogo/${game.id}`}
                  className="group relative overflow-hidden rounded-xl transition-transform hover:-translate-y-0.5 bg-surface-raised"
                >
                  <div className="relative aspect-[460/215]">
                    <Image
                      src={game.coverImage}
                      alt={game.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center bg-black/60">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold bg-primary text-primary-foreground">
                        <Play className="w-3.5 h-3.5" /> Jogar
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[13px] font-semibold text-foreground truncate">{game.title}</p>
                    <p className="text-[11px] mt-0.5 text-text-tertiary">
                      {game.genres.slice(0, 2).join(" · ")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden bg-surface-base">
              {libraryGames.map((game, i) => (
                <Link
                  key={game.id}
                  href={`/jogo/${game.id}`}
                  className={`group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-raised ${i > 0 ? "border-t border-border" : ""}`}
                >
                  <div className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={game.coverImage} alt={game.title} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-foreground truncate">{game.title}</p>
                    <p className="text-[13px] text-muted-foreground">
                      {game.genres.slice(0, 2).join(" · ")}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground">
                    <Play className="w-3 h-3" /> Jogar
                  </span>
                </Link>
              ))}
            </div>
          )}

          {wishlistGames.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[22px] font-bold tracking-tight text-foreground">Lista de Desejos</h2>
                <Link href="/lista-desejos" className="text-[15px] font-medium transition-opacity hover:opacity-70 text-primary">
                  Ver tudo
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {wishlistGames.slice(0, 3).map((game) => (
                  <Link
                    key={game.id}
                    href={`/jogo/${game.id}`}
                    className="group flex gap-3 p-3 rounded-xl transition-colors bg-surface-raised"
                  >
                    <div className="relative w-24 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={game.coverImage} alt={game.title} fill className="object-cover" sizes="96px" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-[13px] font-semibold text-foreground truncate">{game.title}</p>
                      <p className="text-[13px] font-medium mt-0.5 text-primary">
                        {formatPrice(game.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
