"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ordersApi } from "@/lib/api";
import { toast } from "sonner";
import { Trash2, CreditCard, ArrowRight, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
}

export default function CartPage() {
  const { cart, removeFromCart, clearCart, getCartTotal, addToLibrary } = useStore();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const total = getCartTotal();
  const savings = cart.reduce((acc, item) => (item.game.originalPrice ? acc + (item.game.originalPrice - item.game.price) : acc), 0);

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const order = await ordersApi.checkout();
      order.items.forEach((item) => addToLibrary(item.gameId));
      clearCart();
      setCheckoutDone(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao finalizar compra. Tente novamente.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (checkoutDone) {
    return (
      <main id="main-content" className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-sm animate-fade-in">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-success/15">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <p className="text-[24px] font-bold text-foreground mb-2">Compra realizada!</p>
          <p className="text-[15px] mb-8 text-muted-foreground">
            Seus jogos foram adicionados à biblioteca. Boa diversão!
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/biblioteca"
              className="px-5 py-2.5 rounded-xl text-[15px] font-semibold text-primary-foreground bg-primary transition-opacity hover:opacity-80"
            >
              Ver biblioteca
            </Link>
            <Link
              href="/loja"
              className="px-5 py-2.5 rounded-xl text-[15px] font-semibold text-foreground bg-surface-raised transition-opacity hover:opacity-80"
            >
              Continuar
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main id="main-content" className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-surface-inset">
            <ShieldCheck className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-[20px] font-bold text-foreground mb-2">Carrinho vazio</p>
          <p className="text-[15px] mb-8 text-muted-foreground">
            Explore nossa loja e encontre jogos incríveis.
          </p>
          <Link
            href="/loja"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[15px] font-semibold text-primary-foreground bg-primary transition-opacity hover:opacity-80"
          >
            Explorar loja <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 lg:px-6">
        <h1 className="text-[28px] font-bold tracking-tight text-foreground mb-8">Carrinho</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-2">
            {cart.map((item) => (
              <article key={item.game.id} className="flex gap-4 p-4 rounded-2xl bg-surface-raised">
                <Link href={`/jogo/${item.game.id}`} className="relative w-28 h-16 md:w-40 md:h-24 rounded-xl overflow-hidden flex-shrink-0 group">
                  <Image
                    src={item.game.coverImage}
                    alt={item.game.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 112px, 160px"
                  />
                </Link>

                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/jogo/${item.game.id}`} className="text-[15px] font-semibold text-foreground hover:opacity-70 transition-opacity line-clamp-1">
                        {item.game.title}
                      </Link>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.game.genres.slice(0, 2).map((genre) => (
                          <span key={genre} className="text-[11px] px-2 py-0.5 rounded-md bg-surface-inset text-muted-foreground">
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.game.id)}
                      className="p-1.5 rounded-lg flex-shrink-0 transition-colors text-text-tertiary hover:text-destructive"
                      aria-label={`Remover ${item.game.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-2">
                    <p className="text-[12px] text-muted-foreground">{item.game.developer}</p>
                    <div className="text-right">
                      {item.game.discount && (
                        <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-md mb-1 bg-success text-success-foreground">
                          -{item.game.discount}%
                        </span>
                      )}
                      <div className="flex items-baseline gap-2">
                        {item.game.originalPrice && (
                          <span className="text-[12px] line-through text-text-tertiary">
                            {formatPrice(item.game.originalPrice)}
                          </span>
                        )}
                        <span className="text-[15px] font-bold text-primary">
                          {formatPrice(item.game.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            <div className="flex justify-end pt-1">
              <button
                onClick={() => clearCart()}
                className="flex items-center gap-1.5 text-[13px] px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70 text-muted-foreground"
              >
                <Trash2 className="w-3.5 h-3.5" /> Limpar carrinho
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-2xl p-6 sticky top-20 bg-surface-raised">
              <p className="text-[17px] font-bold text-foreground mb-5">Resumo</p>

              <div className="space-y-3">
                <div className="flex justify-between text-[14px]">
                  <span className="text-muted-foreground">
                    Subtotal ({cart.length} {cart.length === 1 ? "jogo" : "jogos"})
                  </span>
                  <span className="text-foreground">{formatPrice(total + savings)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-[14px] text-success">
                    <span>Economia</span>
                    <span>-{formatPrice(savings)}</span>
                  </div>
                )}
                <div className="h-px bg-border my-3" />
                <div className="flex justify-between">
                  <span className="text-[17px] font-bold text-foreground">Total</span>
                  <span className="text-[20px] font-bold text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full mt-6 h-12 rounded-xl text-[15px] font-semibold text-primary-foreground bg-primary flex items-center justify-center gap-2 transition-opacity disabled:opacity-60 hover:opacity-80"
              >
                {checkingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                Finalizar compra
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-3 text-[12px] text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5" />
                Pagamento seguro e criptografado
              </div>

              <Link
                href="/loja"
                className="block mt-4 text-center text-[14px] font-medium transition-opacity hover:opacity-70 text-primary"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
