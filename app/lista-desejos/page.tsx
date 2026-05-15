"use client";

import Image from "next/image";
import Link from "next/link";
import { games } from "@/lib/games-data";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  Bell,
  BellOff,
} from "lucide-react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart, cart } = useStore();
  const wishlistGames = games.filter((g) => wishlist.includes(g.id));

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratuito";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  if (wishlistGames.length === 0) {
    return (
      <main id="main-content" className="min-h-screen pt-20 lg:pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">
              Sua lista de desejos está vazia
            </h1>
            <p className="text-muted-foreground mb-8">
              Adicione jogos à sua lista de desejos para acompanhar promoções e
              lançamentos.
            </p>
            <Link href="/loja">
              <Button size="lg" className="gap-2">
                Explorar loja
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const totalValue = wishlistGames.reduce((total, game) => total + game.price, 0);
  const totalSavings = wishlistGames.reduce((total, game) => {
    if (game.originalPrice) {
      return total + (game.originalPrice - game.price);
    }
    return total;
  }, 0);

  return (
    <main id="main-content" className="min-h-screen pt-20 lg:pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Lista de Desejos</h1>
            <p className="text-muted-foreground">
              {wishlistGames.length} jogos salvos
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Valor total</div>
              <div className="text-xl font-bold text-primary">
                {formatPrice(totalValue)}
              </div>
            </div>
            {totalSavings > 0 && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Economia atual
                </div>
                <div className="text-xl font-bold text-success">
                  {formatPrice(totalSavings)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {wishlistGames.map((game, index) => {
            const inCart = cart.some((item) => item.game.id === game.id);

            return (
              <article
                key={game.id}
                className="glass rounded-2xl p-4 lg:p-6 flex flex-col sm:flex-row gap-4 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image */}
                <Link
                  href={`/jogo/${game.id}`}
                  className="relative w-full sm:w-48 lg:w-64 aspect-video sm:aspect-[460/215] rounded-xl overflow-hidden flex-shrink-0"
                >
                  <Image
                    src={game.coverImage}
                    alt={game.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 192px, 256px"
                  />
                  {game.discount && (
                    <Badge className="absolute top-2 left-2 bg-success text-success-foreground">
                      -{game.discount}%
                    </Badge>
                  )}
                </Link>

                {/* Info */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/jogo/${game.id}`}
                        className="text-lg font-semibold hover:text-primary transition-colors"
                      >
                        {game.title}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {game.developer}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromWishlist(game.id)}
                      className="text-muted-foreground hover:text-destructive flex-shrink-0"
                      aria-label={`Remover ${game.title} da lista de desejos`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {game.genres.slice(0, 3).map((genre) => (
                      <Badge key={genre} variant="secondary" className="text-xs">
                        {genre}
                      </Badge>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2 hidden lg:block">
                    {game.description}
                  </p>

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-auto pt-4">
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      {game.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(game.originalPrice)}
                        </span>
                      )}
                      <span
                        className={`text-xl font-bold ${
                          game.price === 0 ? "text-success" : "text-primary"
                        }`}
                      >
                        {formatPrice(game.price)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        onClick={() => addToCart(game)}
                        disabled={inCart}
                        className="flex-1 sm:flex-initial gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {inCart ? "No carrinho" : "Adicionar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Add all to cart */}
        {wishlistGames.length > 1 && (
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              onClick={() => {
                wishlistGames.forEach((game) => {
                  if (!cart.some((item) => item.game.id === game.id)) {
                    addToCart(game);
                  }
                });
              }}
              className="gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Adicionar todos ao carrinho ({formatPrice(totalValue)})
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
