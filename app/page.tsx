"use client";

import { useGames } from "@/lib/hooks/useGames";
import { GameCard } from "@/components/game-card";
import { ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = ["Ação", "RPG", "Aventura", "Estratégia", "Corrida", "Terror", "Indie", "Simulador"];

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-[22px] font-bold tracking-tight text-foreground">{title}</h2>
      <Link href={href} className="flex items-center gap-0.5 text-[15px] font-medium text-primary hover:opacity-70 transition-opacity">
        Ver todos <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function HomePage() {
  const { games, loading } = useGames({ pageSize: 100 });

  const featuredGames = games.slice(0, 5);
  const popularGames = games.filter((g) => g.reviewCount > 100000).slice(0, 8);
  const newReleases = games.slice(0, 8);
  const onSale = games.filter((g) => g.discount).slice(0, 8);
  const freeGames = games.filter((g) => g.price === 0).slice(0, 4);

  if (loading) {
    return (
      <main className="min-h-screen pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (games.length === 0) {
    return (
      <main className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-[17px] text-foreground mb-1">Nenhum jogo disponível no momento.</p>
          <p className="text-[15px] text-muted-foreground">Verifique se o servidor está rodando.</p>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen pt-16 pb-16">
      {/* Hero */}
      {featuredGames.length > 0 && (
        <section className="mb-12">
          <h1 className="sr-only">Nebula — Sua loja de jogos digitais</h1>
          <div className="grid lg:grid-cols-3 gap-2 px-4 lg:px-6 container mx-auto">
            <Link href={`/jogo/${featuredGames[0].id}`} className="group lg:col-span-2 relative block overflow-hidden rounded-2xl aspect-video">
              <Image
                src={featuredGames[0].coverImage} alt={featuredGames[0].title}
                fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                priority sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, oklch(0.05 0 0 / 0.95) 0%, oklch(0.05 0 0 / 0.3) 40%, transparent 70%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                {featuredGames[0].discount && (
                  <span className="inline-block text-[12px] font-bold px-2.5 py-1 rounded-lg mb-3 bg-success text-success-foreground">
                    -{featuredGames[0].discount}% de desconto
                  </span>
                )}
                <h2 className="text-[28px] lg:text-[34px] font-bold text-white mb-2 leading-tight">{featuredGames[0].title}</h2>
                <p className="text-[15px] mb-5 max-w-xl line-clamp-2 text-white/70">{featuredGames[0].description}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-baseline gap-2">
                    {featuredGames[0].originalPrice && (
                      <span className="text-[15px] line-through text-white/50">R$ {featuredGames[0].originalPrice.toFixed(2)}</span>
                    )}
                    <span className="text-[22px] font-bold" style={{ color: "var(--primary)" }}>
                      {featuredGames[0].price === 0 ? "Gratuito" : `R$ ${featuredGames[0].price.toFixed(2)}`}
                    </span>
                  </div>
                  <span className="px-5 py-2 rounded-full text-[15px] font-semibold text-primary-foreground bg-primary hover:opacity-80 transition-opacity">
                    Ver detalhes
                  </span>
                </div>
              </div>
            </Link>

            <div className="flex flex-col gap-2">
              {featuredGames.slice(1, 3).map((game) => (
                <Link key={game.id} href={`/jogo/${game.id}`} className="group relative flex-1 overflow-hidden rounded-xl min-h-[160px]">
                  <Image
                    src={game.coverImage} alt={game.title} fill priority
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, oklch(0.05 0 0 / 0.9) 0%, transparent 60%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {game.discount && (
                      <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-md mb-1 bg-success text-success-foreground">
                        -{game.discount}%
                      </span>
                    )}
                    <h3 className="text-[15px] font-semibold text-white">{game.title}</h3>
                    <span className="text-[13px] font-bold text-primary">
                      {game.price === 0 ? "Gratuito" : `R$ ${game.price.toFixed(2)}`}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 lg:px-6 space-y-12">
        {freeGames.length > 0 && (
          <section>
            <SectionHeader title="Jogos Gratuitos" href="/loja?filter=free" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {freeGames.map((game) => <GameCard key={game.id} game={game} />)}
            </div>
          </section>
        )}

        {onSale.length > 0 && (
          <section>
            <SectionHeader title="Ofertas Especiais" href="/loja?filter=sale" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {onSale.map((game) => <GameCard key={game.id} game={game} />)}
            </div>
          </section>
        )}

        {popularGames.length > 0 && (
          <section>
            <SectionHeader title="Mais Populares" href="/loja?sort=popular" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {popularGames.map((game) => <GameCard key={game.id} game={game} />)}
            </div>
          </section>
        )}

        <section>
          <SectionHeader title="Lançamentos Recentes" href="/loja?sort=new" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {newReleases.map((game) => <GameCard key={game.id} game={game} />)}
          </div>
        </section>

        <section>
          <h2 className="text-[22px] font-bold tracking-tight text-foreground mb-5">Explorar por Categoria</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat} href={`/loja?genre=${cat}`}
                className="rounded-xl p-4 text-center text-[13px] font-semibold bg-surface-raised text-foreground hover:bg-surface-inset transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
