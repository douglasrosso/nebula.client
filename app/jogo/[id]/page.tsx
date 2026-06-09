"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { useGame } from "@/lib/hooks/useGames";
import { useStore } from "@/lib/store";
import { GameCard } from "@/components/game-card";
import {
  Star, Heart, Check, Play,
  ChevronLeft, ChevronRight, Monitor, Cpu, Calendar, Building, Tag, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { resolveGameCover, resolveGameScreenshots } from "@/lib/image-map";

function formatDate(dateStr: string): string {
  if (!dateStr) return dateStr;
  try {
    return new Date(dateStr).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const TABS = ["about", "requirements"] as const;
type Tab = typeof TABS[number];
const TAB_LABELS: Record<Tab, string> = { about: "Sobre", requirements: "Requisitos" };

/* ─── Styled ─── */
const MainPage = styled.main`
  min-height: 100vh;
  padding-top: 5rem;
  padding-bottom: 4rem;
`;

const LoadingPage = styled.main`
  min-height: 100vh;
  padding-top: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  @media (min-width: 1024px) { padding: 0 1.5rem; }
`;

const Breadcrumb = styled.nav`
  margin-bottom: 1.5rem;
`;

const BreadcrumbList = styled.ol`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: var(--muted-foreground);
  list-style: none;
  margin: 0;
  padding: 0;
`;

const BreadcrumbLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  transition: opacity 150ms;
  &:hover { opacity: 0.7; }
`;

const BreadcrumbCurrent = styled.li`
  color: var(--foreground);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 12.5rem;
`;

const ContentGrid = styled.div`
  display: grid;
  gap: 2rem;
  @media (min-width: 1024px) { grid-template-columns: 2fr 1fr; }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ScreenshotWrapper = styled.div`
  position: relative;
  aspect-ratio: 16/9;
  border-radius: 1rem;
  overflow: hidden;
  background-color: var(--surface-base);
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 200ms;
  background: oklch(0 0 0 / 0.7);
  backdrop-filter: blur(12px);
  border: none;
  cursor: pointer;
  ${ScreenshotWrapper}:hover & { opacity: 1; }
  &:hover { opacity: 0.7 !important; }
`;

const PrevButton = styled(NavButton)`
  left: 0.75rem;
`;

const NextButton = styled(NavButton)`
  right: 0.75rem;
`;

const ThumbnailsRow = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
`;

const Thumbnail = styled.button<{ $active?: boolean }>`
  position: relative;
  width: 5rem;
  height: 3rem;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
  transition: all 150ms;
  border: none;
  padding: 0;
  cursor: pointer;
  opacity: ${({ $active }) => $active ? 1 : 0.45};
  outline: ${({ $active }) => $active ? "2px solid var(--primary)" : "none"};
  outline-offset: 2px;
`;

const TabsWrapper = styled.div`
  margin-top: 1.5rem;
`;

const TabsBar = styled.div`
  display: flex;
  gap: 0.25rem;
  border-radius: 0.75rem;
  padding: 0.25rem;
  margin-bottom: 1.25rem;
  background-color: var(--surface-base);
`;

const TabBtn = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 150ms;
  border: none;
  cursor: pointer;
  background-color: ${({ $active }) => $active ? "var(--surface-raised)" : "transparent"};
  color: ${({ $active }) => $active ? "var(--foreground)" : "var(--muted-foreground)"};
`;

const AboutCard = styled.div`
  border-radius: 1rem;
  padding: 1.5rem;
  background-color: var(--surface-raised);
`;

const AboutTitle = styled.p`
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 0.75rem;
`;

const AboutText = styled.p`
  font-size: 0.9375rem;
  line-height: 1.625;
  color: var(--muted-foreground);
  margin: 0;
`;

const FeaturesCard = styled.div`
  border-radius: 1rem;
  padding: 1.25rem;
  background-color: var(--surface-raised);
`;

const FeaturesTitle = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 0.75rem;
`;

const FeaturesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FeatureTag = styled.span`
  font-size: 0.8125rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background-color: var(--surface-inset);
  color: var(--muted-foreground);
`;

const RequirementsGrid = styled.div`
  display: grid;
  gap: 1rem;
  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
`;

const RequirementsCard = styled.div`
  border-radius: 1rem;
  padding: 1.25rem;
  background-color: var(--surface-raised);
`;

const ReqTitle = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--foreground);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem;
`;

const ReqList = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0;
`;

const ReqTerm = styled.dt`
  font-size: 0.75rem;
  margin: 0 0 0.125rem;
  color: var(--text-tertiary);
`;

const ReqDetail = styled.dd`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
  margin: 0;
`;

/* Right sidebar */
const RightSidebar = styled.div``;

const GamePanel = styled.div`
  border-radius: 1rem;
  padding: 1.5rem;
  background-color: var(--surface-raised);
  @media (min-width: 1024px) { position: sticky; top: 5rem; }
`;

const GameTitle = styled.h1`
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 0.5rem;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const RatingValue = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--foreground);
`;

const ReviewCount = styled.span`
  font-size: 0.8125rem;
  color: var(--muted-foreground);
`;

const GenresList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 1.25rem;
`;

const GenreChip = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  background-color: var(--surface-inset);
  color: var(--muted-foreground);
`;

const PriceSection = styled.div`
  margin-bottom: 1.25rem;
`;

const DiscountBadge = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: var(--success);
  color: var(--success-foreground);
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
`;

const OriginalPrice = styled.span`
  font-size: 0.9375rem;
  text-decoration: line-through;
  color: var(--text-tertiary);
`;

const CurrentPrice = styled.span<{ $free?: boolean }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ $free }) => $free ? "var(--success)" : "var(--primary)"};
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const PrimaryButton = styled.button`
  width: 100%;
  height: 3rem;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--primary-foreground);
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 150ms;
  border: none;
  cursor: pointer;
  &:hover:not(:disabled) { opacity: 0.8; }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const WishlistButton = styled.button<{ $inWishlist?: boolean }>`
  width: 100%;
  height: 2.5rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 150ms;
  background-color: var(--surface-inset);
  color: ${({ $inWishlist }) => $inWishlist ? "var(--destructive)" : "var(--muted-foreground)"};
  border: none;
  cursor: pointer;
  &:hover { opacity: 0.7; }
`;

const MetaList = styled.dl`
  margin: 1.25rem 0 0;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
`;

const MetaIcon = styled.span`
  margin-top: 0.125rem;
  flex-shrink: 0;
  color: var(--text-tertiary);
  display: flex;
  align-items: center;
`;

const MetaLabel = styled.dt`
  font-size: 0.6875rem;
  color: var(--muted-foreground);
  margin: 0;
`;

const MetaValue = styled.dd`
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--foreground);
  margin: 0;
`;

/* Related section */
const RelatedSection = styled.section`
  margin-top: 3rem;
`;

const RelatedTitle = styled.h2`
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--foreground);
  margin: 0 0 1.25rem;
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  @media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); }
`;

const NotFoundCenter = styled.div`
  text-align: center;
`;

const NotFoundTitle = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 1rem;
`;

const BackLink = styled(Link)`
  display: inline-block;
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--primary-foreground);
  background-color: var(--primary);
  text-decoration: none;
`;

export default function GameDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { game, loading } = useGame(id);
  const [screenshot, setScreenshot] = useState(0);
  const [tab, setTab] = useState<Tab>("about");
  const [buying, setBuying] = useState(false);

  const { addToWishlist, removeFromWishlist, isInWishlist, isInLibrary, purchase, requireLogin, apiGames } = useStore();

  if (loading) {
    return (
      <LoadingPage>
        <Loader2 className="animate-spin" style={{ width: "2rem", height: "2rem", color: "var(--primary)" }} />
      </LoadingPage>
    );
  }

  if (!game) {
    return (
      <LoadingPage>
        <NotFoundCenter>
          <NotFoundTitle>Jogo não encontrado</NotFoundTitle>
          <BackLink href="/loja">Voltar para a loja</BackLink>
        </NotFoundCenter>
      </LoadingPage>
    );
  }

  const inWishlist = isInWishlist(game.id);
  const inLibrary = isInLibrary(game.id);
  const relatedGames = apiGames
    .filter((g) => g.id !== game.id && g.genres.some((genre) => game.genres.includes(genre)))
    .slice(0, 4);
  const screenshots = resolveGameScreenshots(game.screenshots, game.coverImage);

  async function handleBuy() {
    if (!requireLogin()) return;
    setBuying(true);
    try {
      await purchase(game!);
      toast.success(`${game!.title} adicionado à biblioteca!`);
    } catch {
      toast.error("Erro ao comprar jogo. Tente novamente.");
    } finally {
      setBuying(false);
    }
  }

  return (
    <MainPage id="main-content">
      <Container>
        <Breadcrumb aria-label="Breadcrumb">
          <BreadcrumbList>
            <li><BreadcrumbLink href="/">Início</BreadcrumbLink></li>
            <ChevronRight style={{ width: "0.875rem", height: "0.875rem" }} />
            <li><BreadcrumbLink href="/loja">Loja</BreadcrumbLink></li>
            <ChevronRight style={{ width: "0.875rem", height: "0.875rem" }} />
            <BreadcrumbCurrent>{game.title}</BreadcrumbCurrent>
          </BreadcrumbList>
        </Breadcrumb>

        <ContentGrid>
          <LeftColumn>
            <ScreenshotWrapper>
              <Image
                src={screenshots[screenshot]}
                alt={`${game.title} — screenshot ${screenshot + 1}`}
                fill
                style={{ objectFit: "cover" }}
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              {screenshots.length > 1 && (
                <>
                  <PrevButton
                    onClick={() => setScreenshot((p) => (p === 0 ? screenshots.length - 1 : p - 1))}
                    aria-label="Screenshot anterior"
                  >
                    <ChevronLeft style={{ width: "1rem", height: "1rem", color: "white" }} />
                  </PrevButton>
                  <NextButton
                    onClick={() => setScreenshot((p) => (p === screenshots.length - 1 ? 0 : p + 1))}
                    aria-label="Próximo screenshot"
                  >
                    <ChevronRight style={{ width: "1rem", height: "1rem", color: "white" }} />
                  </NextButton>
                </>
              )}
            </ScreenshotWrapper>

            {screenshots.length > 1 && (
              <ThumbnailsRow>
                {screenshots.map((s, i) => (
                  <Thumbnail key={i} onClick={() => setScreenshot(i)} $active={screenshot === i}>
                    <Image src={s} alt={`Thumb ${i + 1}`} fill style={{ objectFit: "cover" }} sizes="80px" />
                  </Thumbnail>
                ))}
              </ThumbnailsRow>
            )}

            <TabsWrapper>
              <TabsBar>
                {TABS.map((key) => (
                  <TabBtn key={key} onClick={() => setTab(key)} $active={tab === key}>
                    {TAB_LABELS[key]}
                  </TabBtn>
                ))}
              </TabsBar>

              {tab === "about" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <AboutCard>
                    <AboutTitle>Sobre o jogo</AboutTitle>
                    <AboutText>{game.longDescription || game.description}</AboutText>
                  </AboutCard>
                  {game.features.length > 0 && (
                    <FeaturesCard>
                      <FeaturesTitle>Recursos</FeaturesTitle>
                      <FeaturesList>
                        {game.features.map((f) => <FeatureTag key={f}>{f}</FeatureTag>)}
                      </FeaturesList>
                    </FeaturesCard>
                  )}
                </div>
              )}

              {tab === "requirements" && (
                <RequirementsGrid>
                  {[
                    { label: "Requisitos Mínimos", icon: Monitor, data: game.systemRequirements.minimum },
                    { label: "Recomendados", icon: Cpu, data: game.systemRequirements.recommended },
                  ].map(({ label, icon: Icon, data }) => (
                    <RequirementsCard key={label}>
                      <ReqTitle>
                        <Icon style={{ width: "1rem", height: "1rem", color: "var(--muted-foreground)" }} /> {label}
                      </ReqTitle>
                      <ReqList>
                        {[["SO", data.os], ["Processador", data.processor], ["Memória", data.memory], ["Placa de vídeo", data.graphics], ["Armazenamento", data.storage]].map(([k, v]) =>
                          v ? (
                            <div key={k}>
                              <ReqTerm>{k}</ReqTerm>
                              <ReqDetail>{v}</ReqDetail>
                            </div>
                          ) : null
                        )}
                      </ReqList>
                    </RequirementsCard>
                  ))}
                </RequirementsGrid>
              )}
            </TabsWrapper>
          </LeftColumn>

          <RightSidebar>
            <GamePanel>
              <GameTitle>{game.title}</GameTitle>

              <RatingRow>
                <Star style={{ width: "1rem", height: "1rem", fill: "oklch(0.80 0.18 85)", color: "oklch(0.80 0.18 85)" }} />
                <RatingValue>{game.rating}</RatingValue>
                <ReviewCount>({game.reviewCount.toLocaleString("pt-BR")})</ReviewCount>
              </RatingRow>

              <GenresList>
                {game.genres.map((g) => <GenreChip key={g}>{g}</GenreChip>)}
              </GenresList>

              <PriceSection>
                {game.discount && (
                  <DiscountBadge>-{game.discount}% de desconto</DiscountBadge>
                )}
                <PriceRow>
                  {game.originalPrice && <OriginalPrice>{formatPrice(game.originalPrice)}</OriginalPrice>}
                  <CurrentPrice $free={game.price === 0}>{formatPrice(game.price)}</CurrentPrice>
                </PriceRow>
              </PriceSection>

              <Actions>
                {inLibrary ? (
                  <PrimaryButton>
                    <Play style={{ width: "1rem", height: "1rem" }} /> Jogar agora
                  </PrimaryButton>
                ) : (
                  <PrimaryButton onClick={handleBuy} disabled={buying}>
                    {buying
                      ? <Loader2 className="animate-spin" style={{ width: "1rem", height: "1rem" }} />
                      : game.price === 0
                      ? <><Play style={{ width: "1rem", height: "1rem" }} /> Obter</>
                      : <><Check style={{ width: "1rem", height: "1rem" }} /> Comprar agora</>
                    }
                  </PrimaryButton>
                )}
                {!inLibrary && (
                  <WishlistButton
                    $inWishlist={inWishlist}
                    onClick={() => inWishlist ? removeFromWishlist(game.id) : requireLogin(() => addToWishlist(game.id))}
                  >
                    <Heart style={{ width: "1rem", height: "1rem", fill: inWishlist ? "currentColor" : "none" }} />
                    {inWishlist ? "Remover da lista" : "Lista de desejos"}
                  </WishlistButton>
                )}
              </Actions>

              <MetaList>
                {[
                  { icon: Building, label: "Desenvolvedor", value: game.developer },
                  { icon: Tag, label: "Publicador", value: game.publisher },
                  { icon: Calendar, label: "Lançamento", value: formatDate(game.releaseDate) },
                ].map(({ icon: Icon, label, value }) => (
                  <MetaItem key={label}>
                    <MetaIcon><Icon style={{ width: "1rem", height: "1rem" }} /></MetaIcon>
                    <div>
                      <MetaLabel>{label}</MetaLabel>
                      <MetaValue>{value}</MetaValue>
                    </div>
                  </MetaItem>
                ))}
              </MetaList>
            </GamePanel>
          </RightSidebar>
        </ContentGrid>

        {relatedGames.length > 0 && (
          <RelatedSection>
            <RelatedTitle>Jogos semelhantes</RelatedTitle>
            <RelatedGrid>
              {relatedGames.map((g) => <GameCard key={g.id} game={g} />)}
            </RelatedGrid>
          </RelatedSection>
        )}
      </Container>
    </MainPage>
  );
}
