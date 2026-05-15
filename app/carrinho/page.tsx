"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Trash2,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Tag,
} from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, getCartTotal, addToLibrary } = useStore();
  const total = getCartTotal();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleCheckout = () => {
    // Simulate checkout - add all items to library
    cart.forEach((item) => {
      addToLibrary(item.game.id);
    });
    clearCart();
    alert("Compra realizada com sucesso! Os jogos foram adicionados à sua biblioteca.");
  };

  if (cart.length === 0) {
    return (
      <main id="main-content" className="min-h-screen pt-20 lg:pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground mb-8">
              Explore nossa loja e encontre jogos incríveis para adicionar ao seu carrinho.
            </p>
            <Link href="/loja">
              <Button size="lg" className="gap-2">
                Explorar loja
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const savings = cart.reduce((total, item) => {
    if (item.game.originalPrice) {
      return total + (item.game.originalPrice - item.game.price);
    }
    return total;
  }, 0);

  return (
    <main id="main-content" className="min-h-screen pt-20 lg:pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <article
                key={item.game.id}
                className="glass rounded-2xl p-4 flex gap-4"
              >
                <Link
                  href={`/jogo/${item.game.id}`}
                  className="relative w-32 h-20 md:w-48 md:h-28 rounded-xl overflow-hidden flex-shrink-0"
                >
                  <Image
                    src={item.game.coverImage}
                    alt={item.game.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 128px, 192px"
                  />
                </Link>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/jogo/${item.game.id}`}
                        className="font-semibold hover:text-primary transition-colors"
                      >
                        {item.game.title}
                      </Link>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.game.genres.slice(0, 2).map((genre) => (
                          <Badge
                            key={genre}
                            variant="secondary"
                            className="text-xs"
                          >
                            {genre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.game.id)}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label={`Remover ${item.game.title} do carrinho`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="mt-auto flex items-end justify-between">
                    <div className="text-sm text-muted-foreground">
                      {item.game.developer}
                    </div>
                    <div className="text-right">
                      {item.game.discount && (
                        <Badge className="bg-success/20 text-success text-xs mb-1">
                          -{item.game.discount}%
                        </Badge>
                      )}
                      <div className="flex items-baseline gap-2">
                        {item.game.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(item.game.originalPrice)}
                          </span>
                        )}
                        <span className="font-bold text-primary">
                          {formatPrice(item.game.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <Button
                variant="ghost"
                onClick={clearCart}
                className="text-muted-foreground hover:text-destructive gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Limpar carrinho
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-28">
              <h2 className="text-lg font-bold mb-6">Resumo do pedido</h2>

              <dl className="space-y-4">
                <div className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">
                    Subtotal ({cart.length} {cart.length === 1 ? "jogo" : "jogos"})
                  </dt>
                  <dd>{formatPrice(total + savings)}</dd>
                </div>

                {savings > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <dt className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Economia
                    </dt>
                    <dd>-{formatPrice(savings)}</dd>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <dt>Total</dt>
                  <dd className="text-primary">{formatPrice(total)}</dd>
                </div>
              </dl>

              <Button
                size="lg"
                className="w-full mt-6 gap-2 h-14 text-lg"
                onClick={handleCheckout}
              >
                <CreditCard className="w-5 h-5" />
                Finalizar compra
              </Button>

              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground justify-center">
                <ShieldCheck className="w-4 h-4" />
                Pagamento seguro e criptografado
              </div>

              {/* Continue Shopping */}
              <Link href="/loja" className="block mt-6">
                <Button variant="outline" className="w-full">
                  Continuar comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
