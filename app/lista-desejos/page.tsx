"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { useGames } from "@/lib/hooks/useGames";
import { AuthGuard } from "@/components/auth-guard";
import { Heart, ShoppingCart, Trash2, ArrowRight, Check } from "lucide-react";

function formatPrice(price: number) {
  if (price === 0) return "Gratuito";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
}

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, addToCart, cart, apiGames } = useStore();

  useGames({ pageSize: 200 });

  const wishlistGames = apiGames.filter((g) => wishlist.includes(g.id));
  const totalValue = wishlistGames.reduce((t, g) => t + g.price, 0);
  const totalSavings = wishlistGames.reduce((t, g) => (g.originalPrice ? t + (g.originalPrice - g.price) : t), 0);

  return (
    <AuthGuard>
      <main id="main-content" className="min-h-screen pt-20 pb-16">
        <div className="container mx-auto px-4 lg:px-6">

          {wishlistGames.length === 0 ? (
            <div className="max-w-sm mx-auto text-center py-20">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-surface-inset">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-[20px] font-bold text-foreground mb-2">Lista de desejos vazia</p>
              <p className="text-[15px] mb-8 text-muted-foreground">
                Adicione jogos à sua lista para acompanhar promoções e lançamentos.
              </p>
              <Link
                href="/loja"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[15px] font-semibold text-primary-foreground bg-primary transition-opacity hover:opacity-80"
              >
                Explorar loja <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-[28px] font-bold tracking-tight text-foreground">Lista de Desejos</h1>
                  <p className="text-[15px] mt-0.5 text-muted-foreground">
                    {wishlistGames.length} {wishlistGames.length === 1 ? "jogo" : "jogos"} salvos
                  </p>
                </div>
                <div className="flex gap-6">
                  <div className="text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-wider mb-0.5 text-text-tertiary">Valor total</p>
                    <p className="text-[20px] font-bold text-primary">{formatPrice(totalValue)}</p>
                  </div>
                  {totalSavings > 0 && (
                    <div className="text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-wider mb-0.5 text-text-tertiary">Economia</p>
                      <p className="text-[20px] font-bold text-success">{formatPrice(totalSavings)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden bg-surface-base">
                {wishlistGames.map((game, i) => {
                  const inCart = cart.some((item) => item.game.id === game.id);
                  return (
                    <article
                      key={game.id}
                      className={`flex flex-col sm:flex-row gap-4 p-4 ${i > 0 ? "border-t border-border" : ""}`}
                    >
                      <Link href={`/jogo/${game.id}`} className="relative w-full sm:w-48 aspect-video sm:aspect-[460/215] rounded-xl overflow-hidden flex-shrink-0 group">
                        <Image
                          src={game.coverImage}
                          alt={game.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                          sizes="(max-width: 640px) 100vw, 192px"
                        />
                        {game.discount && (
                          <span className="absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-md bg-success text-success-foreground">
                            -{game.discount}%
                          </span>
                        )}
                      </Link>

                      <div className="flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link href={`/jogo/${game.id}`} className="text-[17px] font-semibold text-foreground hover:opacity-70 transition-opacity">
                              {game.title}
                            </Link>
                            <p className="text-[13px] mt-0.5 text-muted-foreground">{game.developer}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {game.genres.slice(0, 3).map((genre) => (
                                <span key={genre} className="text-[11px] px-2 py-0.5 rounded-md bg-surface-inset text-muted-foreground">
                                  {genre}
                                </span>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromWishlist(game.id)}
                            className="p-1.5 rounded-lg transition-colors flex-shrink-0 text-text-tertiary hover:text-destructive"
                            aria-label={`Remover ${game.title}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-[13px] mt-3 line-clamp-2 hidden lg:block text-muted-foreground">
                          {game.description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto pt-4">
                          <div className="flex items-baseline gap-2">
                            {game.originalPrice && (
                              <span className="text-[13px] line-through text-text-tertiary">
                                {formatPrice(game.originalPrice)}
                              </span>
                            )}
                            <span className={`text-[20px] font-bold ${game.price === 0 ? "text-success" : "text-primary"}`}>
                              {formatPrice(game.price)}
                            </span>
                          </div>
                          <button
                            onClick={() => addToCart(game)}
                            disabled={inCart}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-opacity disabled:opacity-60 ${inCart ? "bg-surface-inset text-foreground" : "bg-primary text-primary-foreground hover:opacity-80"}`}
                          >
                            {inCart ? <><Check className="w-4 h-4" /> No carrinho</> : <><ShoppingCart className="w-4 h-4" /> Adicionar</>}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {wishlistGames.length > 1 && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => wishlistGames.forEach((g) => { if (!cart.some((i) => i.game.id === g.id)) addToCart(g); })}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-[15px] font-semibold text-primary-foreground bg-primary transition-opacity hover:opacity-80"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Adicionar todos ao carrinho
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}
