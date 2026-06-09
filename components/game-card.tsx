"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Loader2 } from "lucide-react";
import styled from "styled-components";
import { type Game, useStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

interface GameCardProps {
  game: Game;
  variant?: "default" | "featured" | "compact";
}

/* ─── Featured variant ─── */
const FeaturedLink = styled(Link)`
  display: block;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  background-color: var(--surface-raised);
  text-decoration: none;
`;

const FeaturedImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
`;

const FeaturedGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, oklch(0.05 0 0) 0%, transparent 60%);
`;

const FeaturedDiscount = styled.span`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: 0.5rem;
  background-color: var(--success);
  color: var(--success-foreground);
`;

const FeaturedInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.25rem;
`;

const FeaturedTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FeaturedPriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FeaturedPriceGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

const FeaturedOriginalPrice = styled.span`
  font-size: 0.8125rem;
  text-decoration: line-through;
  color: rgba(255,255,255,0.5);
`;

const FeaturedRating = styled.span`
  font-size: 0.8125rem;
  color: rgba(255,255,255,0.6);
`;

/* ─── Compact variant ─── */
const CompactLink = styled(Link)`
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background-color: var(--surface-raised);
  transition: background-color 150ms;
  text-decoration: none;
  &:hover { background-color: var(--surface-inset); }
`;

const CompactImageWrapper = styled.div`
  position: relative;
  width: 5rem;
  height: 3rem;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
`;

const CompactInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CompactTitle = styled.h3`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
`;

const CompactPrice = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.125rem;
  color: var(--primary);
`;

/* ─── Default variant ─── */
const DefaultLink = styled(Link)`
  display: flex;
  flex-direction: column;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: transform 200ms;
  background-color: var(--surface-raised);
  text-decoration: none;
  &:hover { transform: translateY(-0.125rem); }
`;

const DefaultImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 460/215;
  overflow: hidden;
`;

const DefaultDiscount = styled.span`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  background-color: var(--success);
  color: var(--success-foreground);
`;

const DefaultLibraryBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  background-color: color-mix(in oklch, var(--primary) 90%, transparent);
  color: var(--primary-foreground);
`;

const DefaultBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0.75rem;
`;

const DefaultTitle = styled.h3`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0 0.25rem;
`;

const DefaultGenres = styled.p`
  font-size: 0.6875rem;
  margin: 0 0 0.75rem;
  color: var(--text-tertiary);
`;

const DefaultFooter = styled.div`
  margin-top: auto;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
`;

const PriceGroup = styled.div`
  min-width: 0;
`;

const OriginalPrice = styled.span`
  font-size: 0.6875rem;
  text-decoration: line-through;
  display: block;
  color: var(--text-tertiary);
`;

const BuyButton = styled.button<{ $loading?: boolean }>`
  flex-shrink: 0;
  height: 1.75rem;
  padding: 0 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 150ms;
  border: none;
  cursor: pointer;
  background-color: color-mix(in oklch, var(--primary) 12%, transparent);
  color: var(--primary);
  &:hover {
    background-color: var(--primary);
    color: var(--primary-foreground);
  }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export function GameCard({ game, variant = "default" }: GameCardProps) {
  const { purchase, isInLibrary, requireLogin } = useStore();
  const [buying, setBuying] = useState(false);
  const inLibrary = isInLibrary(game.id);

  const handleBuy = async (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (inLibrary || buying) return;
    if (!requireLogin()) return;
    setBuying(true);
    try {
      await purchase(game);
      toast.success(`${game.title} adicionado à sua biblioteca!`);
    } catch {
      toast.error("Erro ao comprar o jogo.");
    } finally {
      setBuying(false);
    }
  };

  if (variant === "featured") {
    return (
      <FeaturedLink href={`/jogo/${game.id}`}>
        <FeaturedImageWrapper>
          <Image
            src={game.coverImage} alt={game.title} fill
            style={{ objectFit: "cover", transition: "transform 700ms" }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <FeaturedGradient />
          {game.discount && (
            <FeaturedDiscount>-{game.discount}%</FeaturedDiscount>
          )}
        </FeaturedImageWrapper>
        <FeaturedInfo>
          <FeaturedTitle>{game.title}</FeaturedTitle>
          <FeaturedPriceRow>
            <FeaturedPriceGroup>
              {game.originalPrice && (
                <FeaturedOriginalPrice>{formatPrice(game.originalPrice)}</FeaturedOriginalPrice>
              )}
              <span style={{ fontSize: "1.0625rem", fontWeight: 700, color: game.price === 0 ? "var(--success)" : "var(--primary)" }}>
                {formatPrice(game.price)}
              </span>
            </FeaturedPriceGroup>
            <FeaturedRating>{game.positivePercentage}% positivas</FeaturedRating>
          </FeaturedPriceRow>
        </FeaturedInfo>
      </FeaturedLink>
    );
  }

  if (variant === "compact") {
    return (
      <CompactLink href={`/jogo/${game.id}`}>
        <CompactImageWrapper>
          <Image src={game.coverImage} alt={game.title} fill style={{ objectFit: "cover" }} sizes="80px" />
        </CompactImageWrapper>
        <CompactInfo>
          <CompactTitle>{game.title}</CompactTitle>
          <CompactPrice>{formatPrice(game.price)}</CompactPrice>
        </CompactInfo>
      </CompactLink>
    );
  }

  return (
    <DefaultLink href={`/jogo/${game.id}`}>
      <DefaultImageWrapper>
        <Image
          src={game.coverImage} alt={game.title} fill
          style={{ objectFit: "cover", transition: "transform 500ms" }}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {game.discount && (
          <DefaultDiscount>-{game.discount}%</DefaultDiscount>
        )}
        {inLibrary && (
          <DefaultLibraryBadge>Biblioteca</DefaultLibraryBadge>
        )}
      </DefaultImageWrapper>

      <DefaultBody>
        <DefaultTitle>{game.title}</DefaultTitle>
        <DefaultGenres>{game.genres.slice(0, 2).join(" · ")}</DefaultGenres>

        <DefaultFooter>
          <PriceGroup>
            {game.originalPrice && (
              <OriginalPrice>{formatPrice(game.originalPrice)}</OriginalPrice>
            )}
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: game.price === 0 ? "var(--success)" : "var(--primary)" }}>
              {formatPrice(game.price)}
            </span>
          </PriceGroup>

          <BuyButton
            onClick={handleBuy}
            disabled={buying}
            aria-label={inLibrary ? "Na biblioteca" : game.price === 0 ? "Obter" : "Comprar"}
          >
            {inLibrary
              ? <Play style={{ width: "0.75rem", height: "0.75rem" }} />
              : buying
              ? <Loader2 style={{ width: "0.75rem", height: "0.75rem", animation: "spin 1s linear infinite" }} />
              : game.price === 0
              ? "Obter"
              : "Comprar"}
          </BuyButton>
        </DefaultFooter>
      </DefaultBody>
    </DefaultLink>
  );
}
