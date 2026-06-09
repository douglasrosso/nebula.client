"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { useStore } from "@/lib/store";
import { useGames } from "@/lib/hooks/useGames";
import { AuthGuard } from "@/components/auth-guard";
import { Library, Search, Play, Grid3X3, List } from "lucide-react";
import { resolveGameCover } from "@/lib/image-map";

function formatPrice(price: number) {
  if (price === 0) return "Gratuito";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
}

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

const ViewToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ViewButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 150ms;
  border: none;
  cursor: pointer;
  background-color: ${({ $active }) => $active ? "color-mix(in oklch, var(--primary) 15%, transparent)" : "var(--surface-raised)"};
  color: ${({ $active }) => $active ? "var(--primary)" : "var(--muted-foreground)"};
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 2.5rem;
  padding-left: 2.5rem;
  padding-right: 1rem;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  color: var(--foreground);
  background-color: var(--surface-raised);
  border: none;
  outline: none;
  &::placeholder { color: var(--text-tertiary); }
  @media (min-width: 640px) { width: 18rem; }
`;

const EmptyState = styled.div`
  border-radius: 1rem;
  padding: 4rem;
  text-align: center;
  background-color: var(--surface-base);
`;

const EmptyIcon = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  background-color: var(--surface-inset);
`;

const EmptyTitle = styled.p`
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 0.25rem;
`;

const EmptySubtitle = styled.p`
  font-size: 0.9375rem;
  margin: 0 0 1.5rem;
  color: var(--muted-foreground);
`;

const ExploreLink = styled(Link)`
  display: inline-flex;
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

const GridView = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  @media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
  @media (min-width: 1280px) { grid-template-columns: repeat(5, 1fr); }
`;

const GridCard = styled(Link)`
  display: block;
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  transition: transform 150ms;
  background-color: var(--surface-raised);
  text-decoration: none;
  &:hover { transform: translateY(-0.125rem); }
`;

const GridImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 460/215;
  overflow: hidden;
  img {
    transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1) !important;
  }
  ${GridCard}:hover & img {
    transform: scale(1.05);
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: oklch(0 0 0 / 0.6);
  transition: opacity 200ms;
  ${GridCard}:hover & { opacity: 1; }
`;

const PlayBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  background-color: var(--primary);
  color: var(--primary-foreground);
`;

const GridCardBody = styled.div`
  padding: 0.75rem;
`;

const GridCardTitle = styled.p`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
`;

const GridCardGenres = styled.p`
  font-size: 0.6875rem;
  margin: 0.125rem 0 0;
  color: var(--text-tertiary);
`;

const ListView = styled.div`
  border-radius: 1rem;
  overflow: hidden;
  background-color: var(--surface-base);
`;

const ListItem = styled(Link)<{ $notFirst?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  transition: background-color 150ms;
  text-decoration: none;
  border-top: ${({ $notFirst }) => $notFirst ? "1px solid var(--border)" : "none"};
  &:hover { background-color: var(--surface-raised); }
`;

const ListImageWrapper = styled.div`
  position: relative;
  width: 5rem;
  height: 3rem;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
`;

const ListInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ListTitle = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
`;

const ListGenres = styled.p`
  font-size: 0.8125rem;
  color: var(--muted-foreground);
  margin: 0;
`;

const ListPlayBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 150ms;
  background-color: var(--primary);
  color: var(--primary-foreground);
  ${ListItem}:hover & { opacity: 1; }
`;

const WishlistSection = styled.section`
  margin-top: 3rem;
`;

const WishlistHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--foreground);
  margin: 0;
`;

const ViewAllLink = styled(Link)`
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--primary);
  text-decoration: none;
  transition: opacity 150ms;
  &:hover { opacity: 0.7; }
`;

const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
`;

const WishlistCard = styled(Link)`
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background-color: var(--surface-raised);
  text-decoration: none;
  transition: background-color 150ms;
  &:hover { background-color: var(--surface-inset); }
`;

const WishlistImageWrapper = styled.div`
  position: relative;
  width: 6rem;
  height: 3.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  flex-shrink: 0;
`;

const WishlistInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const WishlistTitle = styled.p`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
`;

const WishlistPrice = styled.p`
  font-size: 0.8125rem;
  font-weight: 500;
  margin: 0.125rem 0 0;
  color: var(--primary);
`;

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
      <MainPage id="main-content">
        <Container>
          <HeaderRow>
            <HeaderLeft>
              <PageTitle>Biblioteca</PageTitle>
              <PageCount>{library.length} {library.length === 1 ? "jogo" : "jogos"}</PageCount>
            </HeaderLeft>
            <ViewToggle>
              <ViewButton onClick={() => setViewMode("grid")} $active={viewMode === "grid"} aria-label="Visualização em grade">
                <Grid3X3 style={{ width: "1rem", height: "1rem" }} />
              </ViewButton>
              <ViewButton onClick={() => setViewMode("list")} $active={viewMode === "list"} aria-label="Visualização em lista">
                <List style={{ width: "1rem", height: "1rem" }} />
              </ViewButton>
            </ViewToggle>
          </HeaderRow>

          <SearchWrapper>
            <SearchIcon><Search style={{ width: "1rem", height: "1rem" }} /></SearchIcon>
            <SearchInput
              type="search"
              placeholder="Pesquisar na biblioteca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>

          {libraryGames.length === 0 ? (
            <EmptyState>
              <EmptyIcon><Library style={{ width: "1.75rem", height: "1.75rem", color: "var(--muted-foreground)" }} /></EmptyIcon>
              <EmptyTitle>{library.length === 0 ? "Biblioteca vazia" : "Nenhum jogo encontrado"}</EmptyTitle>
              <EmptySubtitle>{library.length === 0 ? "Compre jogos na loja para adicioná-los aqui." : "Tente uma busca diferente."}</EmptySubtitle>
              {library.length === 0 && <ExploreLink href="/loja">Explorar loja</ExploreLink>}
            </EmptyState>
          ) : viewMode === "grid" ? (
            <GridView>
              {libraryGames.map((game) => (
                <GridCard key={game.id} href={`/jogo/${game.id}`}>
                  <GridImageWrapper>
                    <Image src={resolveGameCover(game.coverImage)} alt={game.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw" />
                    <GridOverlay>
                      <PlayBadge><Play style={{ width: "0.875rem", height: "0.875rem" }} /> Jogar</PlayBadge>
                    </GridOverlay>
                  </GridImageWrapper>
                  <GridCardBody>
                    <GridCardTitle>{game.title}</GridCardTitle>
                    <GridCardGenres>{game.genres.slice(0, 2).join(" · ")}</GridCardGenres>
                  </GridCardBody>
                </GridCard>
              ))}
            </GridView>
          ) : (
            <ListView>
              {libraryGames.map((game, i) => (
                <ListItem key={game.id} href={`/jogo/${game.id}`} $notFirst={i > 0}>
                  <ListImageWrapper>
                    <Image src={resolveGameCover(game.coverImage)} alt={game.title} fill style={{ objectFit: "cover" }} sizes="80px" />
                  </ListImageWrapper>
                  <ListInfo>
                    <ListTitle>{game.title}</ListTitle>
                    <ListGenres>{game.genres.slice(0, 2).join(" · ")}</ListGenres>
                  </ListInfo>
                  <ListPlayBadge><Play style={{ width: "0.75rem", height: "0.75rem" }} /> Jogar</ListPlayBadge>
                </ListItem>
              ))}
            </ListView>
          )}

          {wishlistGames.length > 0 && (
            <WishlistSection>
              <WishlistHeader>
                <SectionTitle>Lista de Desejos</SectionTitle>
                <ViewAllLink href="/lista-desejos">Ver tudo</ViewAllLink>
              </WishlistHeader>
              <WishlistGrid>
                {wishlistGames.slice(0, 3).map((game) => (
                  <WishlistCard key={game.id} href={`/jogo/${game.id}`}>
                    <WishlistImageWrapper>
                      <Image src={resolveGameCover(game.coverImage)} alt={game.title} fill style={{ objectFit: "cover" }} sizes="96px" />
                    </WishlistImageWrapper>
                    <WishlistInfo>
                      <WishlistTitle>{game.title}</WishlistTitle>
                      <WishlistPrice>{formatPrice(game.price)}</WishlistPrice>
                    </WishlistInfo>
                  </WishlistCard>
                ))}
              </WishlistGrid>
            </WishlistSection>
          )}
        </Container>
      </MainPage>
    </AuthGuard>
  );
}
