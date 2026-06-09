"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { useStore } from "@/lib/store";
import { useGames } from "@/lib/hooks/useGames";
import { AuthGuard } from "@/components/auth-guard";
import { Heart, Trash2, ArrowRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { resolveGameCover } from "@/lib/image-map";

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

const EmptyWrapper = styled.div`
  max-width: 24rem;
  margin: 0 auto;
  text-align: center;
  padding: 5rem 0;
`;

const EmptyIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  background-color: var(--surface-inset);
`;

const EmptyTitle = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 0.5rem;
`;

const EmptySubtitle = styled.p`
  font-size: 0.9375rem;
  margin: 0 0 2rem;
  color: var(--muted-foreground);
`;

const ExploreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--primary-foreground);
  background-color: var(--primary);
  text-decoration: none;
  transition: opacity 150ms;
  &:hover { opacity: 0.8; }
`;

const HeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }
`;

const HeaderLeft = styled.div``;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--foreground);
  margin: 0;
`;

const PageCount = styled.p`
  font-size: 0.9375rem;
  margin: 0.125rem 0 0;
  color: var(--muted-foreground);
`;

const StatsRow = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const StatItem = styled.div`
  text-align: right;
`;

const StatLabel = styled.p`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.125rem;
  color: var(--text-tertiary);
`;

const StatValue = styled.p<{ $color?: string }>`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: ${({ $color }) => $color || "var(--primary)"};
`;

const GamesList = styled.div`
  border-radius: 1rem;
  overflow: hidden;
  background-color: var(--surface-base);
`;

const GameItem = styled.article<{ $notFirst?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-top: ${({ $notFirst }) => $notFirst ? "1px solid var(--border)" : "none"};
  @media (min-width: 640px) { flex-direction: row; }
`;

const GameImageLink = styled(Link)`
  position: relative;
  display: block;
  width: 100%;
  border-radius: 0.75rem;
  overflow: hidden;
  flex-shrink: 0;
  aspect-ratio: 16/9;
  @media (min-width: 640px) {
    width: 12rem;
    aspect-ratio: 460/215;
  }
  img {
    transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  &:hover img {
    transform: scale(1.05);
  }
`;

const DiscountBadge = styled.span`
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

const GameContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const GameTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
`;

const GameInfo = styled.div``;

const GameTitleLink = styled(Link)`
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--foreground);
  text-decoration: none;
  transition: opacity 150ms;
  &:hover { opacity: 0.7; }
`;

const GameDeveloper = styled.p`
  font-size: 0.8125rem;
  margin: 0.125rem 0 0;
  color: var(--muted-foreground);
`;

const GenresList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-top: 0.5rem;
`;

const GenreTag = styled.span`
  font-size: 0.6875rem;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  background-color: var(--surface-inset);
  color: var(--muted-foreground);
`;

const RemoveButton = styled.button`
  padding: 0.375rem;
  border-radius: 0.5rem;
  transition: all 150ms;
  flex-shrink: 0;
  color: var(--text-tertiary);
  background: none;
  border: none;
  cursor: pointer;
  &:hover { color: var(--destructive); }
`;

const GameDescription = styled.p`
  font-size: 0.8125rem;
  margin: 0.75rem 0 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: none;
  color: var(--muted-foreground);
  @media (min-width: 1024px) { display: -webkit-box; }
`;

const GameFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1rem;
  @media (min-width: 640px) { flex-direction: row; align-items: center; justify-content: space-between; }
`;

const PriceGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

const OriginalPrice = styled.span`
  font-size: 0.8125rem;
  text-decoration: line-through;
  color: var(--text-tertiary);
`;

const CurrentPrice = styled.span<{ $free?: boolean }>`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ $free }) => $free ? "var(--success)" : "var(--primary)"};
`;

const LibraryBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: var(--surface-inset);
  color: var(--muted-foreground);
`;

const BuyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: opacity 150ms;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:hover:not(:disabled) { opacity: 0.8; }
`;

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, apiGames, purchase, isInLibrary } = useStore();
  const [buyingId, setBuyingId] = useState<string | null>(null);

  useGames({ pageSize: 200 });

  const wishlistGames = apiGames.filter((g) => wishlist.includes(g.id));
  const totalValue = wishlistGames.reduce((t, g) => t + g.price, 0);
  const totalSavings = wishlistGames.reduce((t, g) => (g.originalPrice ? t + (g.originalPrice - g.price) : t), 0);

  async function handleBuy(game: typeof wishlistGames[number]) {
    setBuyingId(game.id);
    try {
      await purchase(game);
      toast.success(`${game.title} adicionado à biblioteca!`);
    } catch {
      toast.error("Erro ao comprar jogo. Tente novamente.");
    } finally {
      setBuyingId(null);
    }
  }

  return (
    <AuthGuard>
      <MainPage id="main-content">
        <Container>
          {wishlistGames.length === 0 ? (
            <EmptyWrapper>
              <EmptyIcon><Heart style={{ width: "2rem", height: "2rem", color: "var(--muted-foreground)" }} /></EmptyIcon>
              <EmptyTitle>Lista de desejos vazia</EmptyTitle>
              <EmptySubtitle>Adicione jogos à sua lista para acompanhar promoções e lançamentos.</EmptySubtitle>
              <ExploreLink href="/loja">
                Explorar loja <ArrowRight style={{ width: "1rem", height: "1rem" }} />
              </ExploreLink>
            </EmptyWrapper>
          ) : (
            <>
              <HeaderRow>
                <HeaderLeft>
                  <PageTitle>Lista de Desejos</PageTitle>
                  <PageCount>{wishlistGames.length} {wishlistGames.length === 1 ? "jogo" : "jogos"} salvos</PageCount>
                </HeaderLeft>
                <StatsRow>
                  <StatItem>
                    <StatLabel>Valor total</StatLabel>
                    <StatValue>{formatPrice(totalValue)}</StatValue>
                  </StatItem>
                  {totalSavings > 0 && (
                    <StatItem>
                      <StatLabel>Economia</StatLabel>
                      <StatValue $color="var(--success)">{formatPrice(totalSavings)}</StatValue>
                    </StatItem>
                  )}
                </StatsRow>
              </HeaderRow>

              <GamesList>
                {wishlistGames.map((game, i) => {
                  const owned = isInLibrary(game.id);
                  const buying = buyingId === game.id;
                  return (
                    <GameItem key={game.id} $notFirst={i > 0}>
                      <GameImageLink href={`/jogo/${game.id}`}>
                        <Image
                          src={resolveGameCover(game.coverImage)} alt={game.title} fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 640px) 100vw, 192px"
                        />
                        {game.discount && (
                          <DiscountBadge>-{game.discount}%</DiscountBadge>
                        )}
                      </GameImageLink>

                      <GameContent>
                        <GameTop>
                          <GameInfo>
                            <GameTitleLink href={`/jogo/${game.id}`}>{game.title}</GameTitleLink>
                            <GameDeveloper>{game.developer}</GameDeveloper>
                            <GenresList>
                              {game.genres.slice(0, 3).map((genre) => (
                                <GenreTag key={genre}>{genre}</GenreTag>
                              ))}
                            </GenresList>
                          </GameInfo>
                          <RemoveButton onClick={() => removeFromWishlist(game.id)} aria-label={`Remover ${game.title}`}>
                            <Trash2 style={{ width: "1rem", height: "1rem" }} />
                          </RemoveButton>
                        </GameTop>

                        <GameDescription>{game.description}</GameDescription>

                        <GameFooter>
                          <PriceGroup>
                            {game.originalPrice && (
                              <OriginalPrice>{formatPrice(game.originalPrice)}</OriginalPrice>
                            )}
                            <CurrentPrice $free={game.price === 0}>{formatPrice(game.price)}</CurrentPrice>
                          </PriceGroup>
                          {owned ? (
                            <LibraryBadge>
                              <Check style={{ width: "1rem", height: "1rem" }} /> Na biblioteca
                            </LibraryBadge>
                          ) : (
                            <BuyButton onClick={() => handleBuy(game)} disabled={buying}>
                              {buying ? <Loader2 className="animate-spin" style={{ width: "1rem", height: "1rem" }} /> : "Comprar"}
                            </BuyButton>
                          )}
                        </GameFooter>
                      </GameContent>
                    </GameItem>
                  );
                })}
              </GamesList>
            </>
          )}
        </Container>
      </MainPage>
    </AuthGuard>
  );
}
