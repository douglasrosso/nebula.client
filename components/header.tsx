"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Store,
  Library,
  User,
  ShoppingCart,
  Search,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/loja", label: "Loja", icon: Store },
  { href: "/biblioteca", label: "Biblioteca", icon: Library },
  { href: "/perfil", label: "Perfil", icon: User },
];

export function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { searchQuery, setSearchQuery, getCartCount, user, wishlist } = useStore();
  const cartCount = getCartCount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-glass-border">
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight"
            aria-label="Nebula - Página inicial"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-sm">V</span>
            </div>
            <span className="hidden sm:inline bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Nebula
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1"
            role="navigation"
            aria-label="Navegação principal"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Desktop Search */}
            <div className="hidden md:flex relative">
              {isSearchOpen ? (
                <div className="flex items-center gap-2 animate-fade-in">
                  <Input
                    type="search"
                    placeholder="Pesquisar jogos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 bg-secondary/50 border-glass-border"
                    autoFocus
                    aria-label="Pesquisar jogos"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    aria-label="Fechar pesquisa"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Abrir pesquisa"
                >
                  <Search className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Wishlist */}
            <Link href="/lista-desejos" aria-label={`Lista de desejos, ${wishlist.length} itens`}>
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-accent">
                    {wishlist.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/carrinho" aria-label={`Carrinho, ${cartCount} itens`}>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Avatar */}
            <Link href="/perfil" className="hidden sm:block">
              <Avatar className="w-9 h-9 border-2 border-primary/50 transition-transform hover:scale-105">
                <AvatarImage src={user?.avatar} alt={user?.displayName} />
                <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" aria-label="Abrir menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass w-80">
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Pesquisar jogos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-secondary/50"
                      aria-label="Pesquisar jogos"
                    />
                  </div>

                  {/* Mobile Nav */}
                  <nav className="flex flex-col gap-2" aria-label="Menu móvel">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            isActive
                              ? "bg-primary/20 text-primary"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                          }`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          <Icon className="w-5 h-5" aria-hidden="true" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* User Info */}
                  {user && (
                    <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-xl mt-auto">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} alt={user.displayName} />
                        <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user.displayName}</p>
                        <p className="text-sm text-muted-foreground">Nível {user.level}</p>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
