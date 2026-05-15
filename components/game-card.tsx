"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Heart, Check, Play } from "lucide-react";
import { type Game } from "@/lib/games-data";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GameCardProps {
  game: Game;
  variant?: "default" | "featured" | "compact";
}

export function GameCard({ game, variant = "default" }: GameCardProps) {
  const {
    addToCart,
    cart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isInLibrary,
  } = useStore();

  const inCart = cart.some((item) => item.game.id === game.id);
  const inWishlist = isInWishlist(game.id);
  const inLibrary = isInLibrary(game.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inCart && !inLibrary) {
      addToCart(game);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(game.id);
    } else {
      addToWishlist(game.id);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratuito";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  if (variant === "featured") {
    return (
      <Link
        href={`/jogo/${game.id}`}
        className="group relative block overflow-hidden rounded-2xl glass glass-hover transition-all duration-300"
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={game.coverImage}
            alt={game.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
          
          {/* Discount Badge */}
          {game.discount && (
            <Badge className="absolute top-4 left-4 bg-success text-success-foreground text-sm px-3 py-1">
              -{game.discount}%
            </Badge>
          )}

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold mb-2 text-balance">{game.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {game.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {game.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(game.originalPrice)}
                  </span>
                )}
                <span className="text-xl font-bold text-primary">
                  {formatPrice(game.price)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="text-sm font-medium">{game.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/jogo/${game.id}`}
        className="group flex gap-4 p-3 rounded-xl glass glass-hover transition-all duration-200"
      >
        <div className="relative w-24 h-14 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={game.coverImage}
            alt={game.title}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
            {game.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {game.discount && (
              <Badge variant="secondary" className="text-xs bg-success/20 text-success">
                -{game.discount}%
              </Badge>
            )}
            <span className="text-sm font-medium text-primary">
              {formatPrice(game.price)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/jogo/${game.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl glass transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-[460/215] overflow-hidden">
        <Image
          src={game.coverImage}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          {inLibrary ? (
            <Button size="sm" className="gap-2">
              <Play className="w-4 h-4" />
              Jogar
            </Button>
          ) : (
            <>
              <Button
                size="icon"
                variant="secondary"
                onClick={handleWishlist}
                aria-label={inWishlist ? "Remover da lista de desejos" : "Adicionar à lista de desejos"}
                className={inWishlist ? "text-destructive" : ""}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
              </Button>
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={inCart}
                className="gap-2"
              >
                {inCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    No carrinho
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Comprar
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {game.discount && (
            <Badge className="bg-success text-success-foreground text-xs">
              -{game.discount}%
            </Badge>
          )}
          {inLibrary && (
            <Badge className="bg-primary text-primary-foreground text-xs">
              Na biblioteca
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {game.title}
        </h3>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {game.genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="secondary" className="text-xs px-2 py-0">
              {genre}
            </Badge>
          ))}
        </div>

        {/* Rating & Price */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-warning text-warning" />
            <span className="text-xs text-muted-foreground">
              {game.positivePercentage}% positivas
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {game.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(game.originalPrice)}
              </span>
            )}
            <span className={`text-sm font-bold ${game.price === 0 ? "text-success" : "text-primary"}`}>
              {formatPrice(game.price)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
