"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Check } from "lucide-react";
import { type Game } from "@/lib/store";
import { useStore } from "@/lib/store";

interface GameCardProps {
  game: Game;
  variant?: "default" | "featured" | "compact";
}

export function GameCard({ game, variant = "default" }: GameCardProps) {
  const { addToCart, cart, addToWishlist, removeFromWishlist, isInWishlist, isInLibrary, requireLogin } = useStore();

  const inCart = cart.some((item) => item.game.id === game.id);
  const inWishlist = isInWishlist(game.id);
  const inLibrary = isInLibrary(game.id);

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (inLibrary || inCart) return;
    requireLogin(() => addToCart(game));
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (inWishlist) removeFromWishlist(game.id);
    else requireLogin(() => addToWishlist(game.id));
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratuito";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
  };

  if (variant === "featured") {
    return (
      <Link href={`/jogo/${game.id}`} className="group relative block overflow-hidden rounded-2xl bg-surface-raised">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={game.coverImage} alt={game.title} fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, oklch(0.05 0 0) 0%, transparent 60%)" }} />
          {game.discount && (
            <span className="absolute top-3 left-3 text-[12px] font-bold px-2.5 py-1 rounded-lg bg-success text-success-foreground">
              -{game.discount}%
            </span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-[20px] font-bold text-white mb-1 line-clamp-1">{game.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              {game.originalPrice && (
                <span className="text-[13px] line-through text-white/50">{formatPrice(game.originalPrice)}</span>
              )}
              <span className="text-[17px] font-bold" style={{ color: game.price === 0 ? "var(--success)" : "var(--primary)" }}>
                {formatPrice(game.price)}
              </span>
            </div>
            <span className="text-[13px] text-white/60">{game.positivePercentage}% positivas</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link href={`/jogo/${game.id}`} className="group flex gap-3 p-3 rounded-xl bg-surface-raised transition-colors">
        <div className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={game.coverImage} alt={game.title} fill className="object-cover" sizes="80px" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-[13px] font-semibold text-foreground truncate">{game.title}</h3>
          <span className="text-[12px] font-medium mt-0.5 text-primary">{formatPrice(game.price)}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/jogo/${game.id}`}
      className="group flex flex-col rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 bg-surface-raised"
    >
      <div className="relative aspect-[460/215] overflow-hidden">
        <Image
          src={game.coverImage} alt={game.title} fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {game.discount && (
          <span className="absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-md bg-success text-success-foreground">
            -{game.discount}%
          </span>
        )}
        {inLibrary && (
          <span className="absolute top-2 right-2 text-[11px] font-bold px-2 py-0.5 rounded-md bg-primary/90 text-primary-foreground">
            Biblioteca
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3">
        <h3 className="text-[13px] font-semibold text-foreground line-clamp-1 mb-1">{game.title}</h3>
        <p className="text-[11px] mb-3 text-text-tertiary">{game.genres.slice(0, 2).join(" · ")}</p>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="min-w-0">
            {game.originalPrice && (
              <span className="text-[11px] line-through block text-text-tertiary">{formatPrice(game.originalPrice)}</span>
            )}
            <span className={`text-[13px] font-bold ${game.price === 0 ? "text-success" : "text-primary"}`}>
              {formatPrice(game.price)}
            </span>
          </div>

          <button
            onClick={handleAction}
            className="flex-shrink-0 h-7 px-3 rounded-full text-[12px] font-semibold transition-all duration-150 bg-primary/12 text-primary hover:bg-primary hover:text-primary-foreground"
            aria-label={inLibrary ? "Jogar" : inCart ? "No carrinho" : "Adicionar ao carrinho"}
          >
            {inLibrary ? <Play className="w-3 h-3" /> : inCart ? <Check className="w-3 h-3" /> : game.price === 0 ? "Obter" : "Comprar"}
          </button>
        </div>
      </div>
    </Link>
  );
}
