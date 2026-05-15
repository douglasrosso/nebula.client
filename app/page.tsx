"use client";

import { games } from "@/lib/games-data";
import { GameCard } from "@/components/game-card";
import { ChevronRight, TrendingUp, Sparkles, Clock, Gift } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const featuredGames = games.slice(0, 3);
  const popularGames = games.filter((g) => g.reviewCount > 200000).slice(0, 8);
  const newReleases = games.slice(0, 8);
  const onSale = games.filter((g) => g.discount).slice(0, 8);
  const freeGames = games.filter((g) => g.price === 0);

  return (
    <main id="main-content" className="min-h-screen pt-20 lg:pt-24 pb-12">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-12" aria-labelledby="hero-heading">
        <h1 id="hero-heading" className="sr-only">
          Nebula - Sua loja de jogos digitais
        </h1>
        
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Main Featured */}
          <div className="lg:col-span-2">
            <Link
              href={`/jogo/${featuredGames[0].id}`}
              className="group relative block overflow-hidden rounded-3xl aspect-[16/9]"
            >
              <Image
                src={featuredGames[0].coverImage}
                alt={featuredGames[0].title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                {featuredGames[0].discount && (
                  <Badge className="mb-3 bg-success text-success-foreground text-sm px-4 py-1">
                    -{featuredGames[0].discount}% de desconto
                  </Badge>
                )}
                <h2 className="text-2xl lg:text-4xl font-bold mb-2 text-balance">
                  {featuredGames[0].title}
                </h2>
                <p className="text-muted-foreground mb-4 line-clamp-2 max-w-xl">
                  {featuredGames[0].description}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {featuredGames[0].originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        R$ {featuredGames[0].originalPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-2xl font-bold text-primary">
                      R$ {featuredGames[0].price.toFixed(2)}
                    </span>
                  </div>
                  <Button size="lg" className="rounded-xl">
                    Ver detalhes
                  </Button>
                </div>
              </div>
            </Link>
          </div>

          {/* Side Featured */}
          <div className="flex flex-col gap-4">
            {featuredGames.slice(1, 3).map((game) => (
              <Link
                key={game.id}
                href={`/jogo/${game.id}`}
                className="group relative flex-1 overflow-hidden rounded-2xl min-h-[200px]"
              >
                <Image
                  src={game.coverImage}
                  alt={game.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {game.discount && (
                    <Badge className="mb-2 bg-success/90 text-success-foreground text-xs">
                      -{game.discount}%
                    </Badge>
                  )}
                  <h3 className="font-semibold text-lg">{game.title}</h3>
                  <span className="text-primary font-bold">
                    R$ {game.price.toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Free Games */}
      {freeGames.length > 0 && (
        <section className="container mx-auto px-4 mb-12" aria-labelledby="free-games">
          <div className="glass rounded-2xl p-6 border border-success/30 bg-success/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                <Gift className="w-5 h-5 text-success" aria-hidden="true" />
              </div>
              <div>
                <h2 id="free-games" className="text-xl font-bold">
                  Jogos Gratuitos
                </h2>
                <p className="text-sm text-muted-foreground">
                  Jogue agora sem gastar nada
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {freeGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* On Sale */}
      <section className="container mx-auto px-4 mb-12" aria-labelledby="on-sale">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-destructive" aria-hidden="true" />
            </div>
            <div>
              <h2 id="on-sale" className="text-xl font-bold">
                Ofertas Especiais
              </h2>
              <p className="text-sm text-muted-foreground">
                Aproveite os melhores descontos
              </p>
            </div>
          </div>
          <Link href="/loja?filter=sale">
            <Button variant="ghost" className="gap-2">
              Ver todas
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {onSale.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Popular Games */}
      <section className="container mx-auto px-4 mb-12" aria-labelledby="popular-games">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h2 id="popular-games" className="text-xl font-bold">
                Mais Populares
              </h2>
              <p className="text-sm text-muted-foreground">
                Os jogos mais jogados pela comunidade
              </p>
            </div>
          </div>
          <Link href="/loja?sort=popular">
            <Button variant="ghost" className="gap-2">
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section className="container mx-auto px-4 mb-12" aria-labelledby="new-releases">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" aria-hidden="true" />
            </div>
            <div>
              <h2 id="new-releases" className="text-xl font-bold">
                Lançamentos Recentes
              </h2>
              <p className="text-sm text-muted-foreground">
                Os jogos mais recentes na loja
              </p>
            </div>
          </div>
          <Link href="/loja?sort=new">
            <Button variant="ghost" className="gap-2">
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {newReleases.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4" aria-labelledby="categories">
        <h2 id="categories" className="text-xl font-bold mb-6">
          Explorar por Categoria
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {["Ação", "RPG", "Aventura", "Estratégia", "Corrida", "Terror"].map(
            (category) => (
              <Link
                key={category}
                href={`/loja?genre=${category}`}
                className="glass glass-hover rounded-2xl p-6 text-center transition-all duration-200 hover:-translate-y-1"
              >
                <span className="font-semibold">{category}</span>
              </Link>
            )
          )}
        </div>
      </section>
    </main>
  );
}
