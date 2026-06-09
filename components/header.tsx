"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Store, Library, Heart, MessageCircle,
  Search, Menu, X, LogIn, LogOut, Sun, Moon,
} from "lucide-react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { useStore } from "@/lib/store";
import { avatarUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet, SheetContent, SheetTrigger, SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/loja", label: "Loja", icon: Store },
  { href: "/biblioteca", label: "Biblioteca", icon: Library },
  { href: "/lista-desejos", label: "Lista de Desejos", icon: Heart },
  { href: "/chat", label: "Chat", icon: MessageCircle },
];

/* ─── Styled ─── */
const StyledHeader = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: var(--glass-bg);
  backdrop-filter: blur(40px) saturate(150%);
  -webkit-backdrop-filter: blur(40px) saturate(150%);
  border-bottom: 1px solid var(--glass-border);
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  @media (min-width: 1024px) { padding: 0 1.5rem; }
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  flex-shrink: 0;
  text-decoration: none;
`;

const LogoIcon = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
  background: linear-gradient(145deg, oklch(0.55 0.26 258), oklch(0.45 0.24 280));
`;

const LogoLetter = styled.span`
  color: white;
  font-weight: 900;
  font-size: 0.875rem;
  letter-spacing: -0.025em;
`;

const LogoName = styled.span`
  display: none;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--foreground);
  @media (min-width: 640px) { display: inline; }
`;

const DesktopNav = styled.nav`
  display: none;
  align-items: center;
  gap: 0.125rem;
  @media (min-width: 1024px) { display: flex; }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 150ms;
  text-decoration: none;
  background-color: ${({ $active }) => $active ? "color-mix(in oklch, var(--primary) 12%, transparent)" : "transparent"};
  color: ${({ $active }) => $active ? "var(--primary)" : "var(--muted-foreground)"};
  &:hover {
    color: ${({ $active }) => $active ? "var(--primary)" : "var(--foreground)"};
    background-color: ${({ $active }) => $active ? "color-mix(in oklch, var(--primary) 12%, transparent)" : "color-mix(in oklch, var(--foreground) 5%, transparent)"};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const SearchWrapper = styled.div`
  display: none;
  align-items: center;
  @media (min-width: 768px) { display: flex; }
`;

const SearchOpenWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  animation: fadeIn 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
`;

const BadgeWrapper = styled.span`
  position: absolute;
  top: -0.125rem;
  right: -0.125rem;
  width: 1rem;
  height: 1rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  border: 0;
`;

const UserTrigger = styled.button`
  display: none;
  margin-left: 0.25rem;
  border-radius: 9999px;
  border: 2px solid transparent;
  background: none;
  cursor: pointer;
  padding: 0;
  transition: all 150ms;
  &:hover { border-color: color-mix(in oklch, var(--primary) 40%, transparent); }
  @media (min-width: 640px) { display: block; }
`;

const LoginLink = styled(Link)`
  display: none;
  margin-left: 0.25rem;
  @media (min-width: 640px) { display: block; }
`;

const MobileSheetInner = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SheetLogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
`;

const SheetLogoName = styled.span`
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--foreground);
`;

const SheetBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem;
`;

const SheetSearchWrapper = styled.div`
  position: relative;
`;

const SheetSearchIcon = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
`;

const SheetNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SheetNavLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 150ms;
  text-decoration: none;
  background-color: ${({ $active }) => $active ? "color-mix(in oklch, var(--primary) 12%, transparent)" : "transparent"};
  color: ${({ $active }) => $active ? "var(--primary)" : "var(--muted-foreground)"};
  &:hover {
    color: ${({ $active }) => $active ? "var(--primary)" : "var(--foreground)"};
    background-color: ${({ $active }) => $active ? "color-mix(in oklch, var(--primary) 12%, transparent)" : "color-mix(in oklch, var(--foreground) 5%, transparent)"};
  }
`;

const SheetFooter = styled.div`
  padding: 1.25rem;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AppearanceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  background-color: var(--surface-inset);
`;

const AppearanceLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.p`
  font-weight: 600;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
  color: var(--foreground);
`;

const UserHandle = styled.p`
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin: 0;
`;

const PlaceholderDiv = styled.div`
  width: 2.25rem;
  height: 2.25rem;
`;

const MobileMenuButton = styled(Button)`
  margin-left: 0.25rem;
  @media (min-width: 1024px) { display: none !important; }
`;

/* ─── ThemeToggle ─── */
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <PlaceholderDiv />;

  return (
    <Button
      variant="ghost"
      size="icon"
      style={{ height: "2.25rem", width: "2.25rem" }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {theme === "dark" ? <Sun style={{ width: "1rem", height: "1rem" }} /> : <Moon style={{ width: "1rem", height: "1rem" }} />}
    </Button>
  );
}

/* ─── Header ─── */
export function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery, user, wishlist, isLoggedIn, logout } = useStore();
  const totalUnread = useStore((s) => Object.values(s.unreadByFriend).reduce((a, b) => a + b, 0));

  return (
    <StyledHeader>
      <a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>
      <Container>
        <Inner>
          {/* Logo */}
          <LogoLink href="/loja" aria-label="Nebula">
            <LogoIcon>
              <LogoLetter>N</LogoLetter>
            </LogoIcon>
            <LogoName>Nebula</LogoName>
          </LogoLink>

          {/* Desktop nav */}
          <DesktopNav aria-label="Navegação principal">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  $active={isActive}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </DesktopNav>

          {/* Actions */}
          <Actions>
            {/* Search */}
            <SearchWrapper>
              {isSearchOpen ? (
                <SearchOpenWrapper>
                  <Input
                    type="search"
                    placeholder="Pesquisar jogos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: "14rem", height: "2.25rem", fontSize: "0.875rem" }}
                    autoFocus
                    aria-label="Pesquisar jogos"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    style={{ height: "2.25rem", width: "2.25rem", flexShrink: 0 }}
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                    aria-label="Fechar pesquisa"
                  >
                    <X style={{ width: "1rem", height: "1rem" }} />
                  </Button>
                </SearchOpenWrapper>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  style={{ height: "2.25rem", width: "2.25rem" }}
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Abrir pesquisa"
                >
                  <Search style={{ width: "1rem", height: "1rem" }} />
                </Button>
              )}
            </SearchWrapper>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Wishlist */}
            <Link href="/lista-desejos" aria-label={`Lista de desejos, ${wishlist.length} itens`}>
              <Button variant="ghost" size="icon" style={{ height: "2.25rem", width: "2.25rem", position: "relative" }}>
                <Heart style={{ width: "1rem", height: "1rem" }} />
                {wishlist.length > 0 && (
                  <Badge style={{ position: "absolute", top: "-0.125rem", right: "-0.125rem", width: "1rem", height: "1rem", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.625rem", border: 0 }}>
                    {wishlist.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Chat */}
            <Link href="/chat" aria-label={`Chat${totalUnread > 0 ? `, ${totalUnread} mensagens não lidas` : ""}`}>
              <Button variant="ghost" size="icon" style={{ height: "2.25rem", width: "2.25rem", position: "relative" }}>
                <MessageCircle style={{ width: "1rem", height: "1rem" }} />
                {totalUnread > 0 && (
                  <Badge style={{ position: "absolute", top: "-0.125rem", right: "-0.125rem", width: "1rem", height: "1rem", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.625rem", border: 0 }}>
                    {totalUnread > 99 ? "99+" : totalUnread}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User */}
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <UserTrigger>
                    <Avatar style={{ width: "2rem", height: "2rem" }}>
                      <AvatarImage src={avatarUrl(user)} alt={user.displayName} />
                      <AvatarFallback style={{ fontSize: "0.75rem" }}>{user.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </UserTrigger>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" style={{ width: "13rem", marginTop: "0.25rem" }}>
                  <div style={{ padding: "0.625rem 0.75rem" }}>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem", margin: 0, color: "var(--foreground)" }}>{user.displayName}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", margin: 0 }}>@{user.username}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    style={{ gap: "0.5rem", cursor: "pointer" }}
                    variant="destructive"
                  >
                    <LogOut style={{ width: "1rem", height: "1rem" }} /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <LoginLink href="/login">
                <Button variant="outline" size="sm" style={{ height: "2rem", gap: "0.375rem", fontSize: "0.875rem", fontWeight: 500 }}>
                  <LogIn style={{ width: "0.875rem", height: "0.875rem" }} /> Entrar
                </Button>
              </LoginLink>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <MobileMenuButton
                  variant="ghost"
                  size="icon"
                  style={{ height: "2.25rem", width: "2.25rem" }}
                  aria-label="Abrir menu"
                >
                  <Menu style={{ width: "1rem", height: "1rem" }} />
                </MobileMenuButton>
              </SheetTrigger>
              <SheetContent side="right" style={{ width: "18rem", padding: 0, backgroundColor: "var(--background)" }}>
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                <MobileSheetInner>
                  <SheetLogoRow>
                    <LogoIcon>
                      <LogoLetter>N</LogoLetter>
                    </LogoIcon>
                    <SheetLogoName>Nebula</SheetLogoName>
                  </SheetLogoRow>

                  <SheetBody>
                    <SheetSearchWrapper>
                      <SheetSearchIcon>
                        <Search style={{ width: "1rem", height: "1rem" }} />
                      </SheetSearchIcon>
                      <Input
                        type="search"
                        placeholder="Pesquisar jogos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: "2.25rem", height: "2.5rem", fontSize: "0.875rem" }}
                        aria-label="Pesquisar jogos"
                      />
                    </SheetSearchWrapper>

                    <SheetNav aria-label="Menu móvel">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <SheetNavLink
                            key={item.href}
                            href={item.href}
                            $active={isActive}
                            onClick={() => setMobileMenuOpen(false)}
                            aria-current={isActive ? "page" : undefined}
                          >
                            <Icon style={{ width: "1rem", height: "1rem", flexShrink: 0 }} aria-hidden="true" />
                            {item.label}
                          </SheetNavLink>
                        );
                      })}
                    </SheetNav>
                  </SheetBody>

                  <SheetFooter>
                    <AppearanceRow>
                      <AppearanceLabel>Aparência</AppearanceLabel>
                      <ThemeToggle />
                    </AppearanceRow>

                    {user ? (
                      <UserRow>
                        <Avatar style={{ width: "2.5rem", height: "2.5rem" }}>
                          <AvatarImage src={user.avatar} alt={user.displayName} />
                          <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <UserInfo>
                          <UserName>{user.displayName}</UserName>
                          <UserHandle>@{user.username}</UserHandle>
                        </UserInfo>
                        <Button
                          variant="ghost"
                          size="icon"
                          style={{ height: "2rem", width: "2rem", color: "var(--muted-foreground)" }}
                          onClick={() => logout()}
                          aria-label="Sair"
                        >
                          <LogOut style={{ width: "1rem", height: "1rem" }} />
                        </Button>
                      </UserRow>
                    ) : (
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button style={{ width: "100%", gap: "0.5rem" }}>
                          <LogIn style={{ width: "1rem", height: "1rem" }} /> Entrar
                        </Button>
                      </Link>
                    )}
                  </SheetFooter>
                </MobileSheetInner>
              </SheetContent>
            </Sheet>
          </Actions>
        </Inner>
      </Container>
    </StyledHeader>
  );
}
