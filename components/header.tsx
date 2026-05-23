"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Store, Library, Heart, MessageCircle,
  Search, Menu, X, LogIn, LogOut, Sun, Moon,
} from "lucide-react";
import { useState, useEffect } from "react";
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

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery, user, wishlist, isLoggedIn, logout } = useStore();
  const totalUnread = useStore((s) => Object.values(s.unreadByFriend).reduce((a, b) => a + b, 0));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-glass-border">
      <a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/loja" className="flex items-center gap-2.5 shrink-0" aria-label="Nebula">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: "linear-gradient(145deg, oklch(0.55 0.26 258), oklch(0.45 0.24 280))" }}
            >
              <span className="text-white font-black text-sm tracking-tight">N</span>
            </div>
            <span className="hidden sm:inline text-base font-bold tracking-tight text-foreground">
              Nebula
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Navegação principal">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-primary/12 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <div className="hidden md:flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center gap-1 animate-fade-in">
                  <Input
                    type="search"
                    placeholder="Pesquisar jogos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-56 h-9 text-sm"
                    autoFocus
                    aria-label="Pesquisar jogos"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                    aria-label="Fechar pesquisa"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Abrir pesquisa"
                >
                  <Search className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Wishlist */}
            <Link href="/lista-desejos" aria-label={`Lista de desejos, ${wishlist.length} itens`}>
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center text-[10px] border-0">
                    {wishlist.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Chat */}
            <Link href="/chat" aria-label={`Chat${totalUnread > 0 ? `, ${totalUnread} mensagens não lidas` : ""}`}>
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <MessageCircle className="w-4 h-4" />
                {totalUnread > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center text-[10px] border-0">
                    {totalUnread > 99 ? "99+" : totalUnread}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User */}
            {isLoggedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:block ml-1 rounded-full ring-2 ring-transparent hover:ring-primary/40 transition-all duration-150">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={avatarUrl(user)}
                        alt={user.displayName}
                      />
                      <AvatarFallback className="text-xs">{user.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 mt-1">
                  <div className="px-3 py-2.5">
                    <p className="font-semibold text-sm">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="gap-2 text-destructive cursor-pointer focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="hidden sm:block ml-1">
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-sm font-medium">
                  <LogIn className="w-3.5 h-3.5" /> Entrar
                </Button>
              </Link>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden ml-1">
                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Abrir menu">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 border-border p-0 bg-background">
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2.5 px-6 py-5 border-b border-border">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(145deg, oklch(0.55 0.26 258), oklch(0.45 0.24 280))" }}
                    >
                      <span className="text-white font-black text-sm">N</span>
                    </div>
                    <span className="font-bold tracking-tight">Nebula</span>
                  </div>

                  <div className="flex-1 flex flex-col gap-5 p-5">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Pesquisar jogos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 text-sm"
                        aria-label="Pesquisar jogos"
                      />
                    </div>

                    <nav className="flex flex-col gap-1" aria-label="Menu móvel">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                              isActive
                                ? "bg-primary/12 text-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                            }`}
                            aria-current={isActive ? "page" : undefined}
                          >
                            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </nav>
                  </div>

                  <div className="p-5 border-t border-border space-y-3">
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-inset">
                      <span className="text-sm font-medium">Aparência</span>
                      <ThemeToggle />
                    </div>

                    {user ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.avatar} alt={user.displayName} />
                          <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{user.displayName}</p>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => logout()}
                          aria-label="Sair"
                        >
                          <LogOut className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full gap-2">
                          <LogIn className="w-4 h-4" /> Entrar
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
