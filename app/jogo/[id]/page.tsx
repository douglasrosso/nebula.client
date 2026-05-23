"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGame } from "@/lib/hooks/useGames";
import { useStore } from "@/lib/store";
import { GameCard } from "@/components/game-card";
import {
  Star, Heart, Check, Play,
  ChevronLeft, ChevronRight, Monitor, Cpu, Calendar, Building, Tag, Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

const TABS = ["about", "requirements"] as const;
type Tab = typeof TABS[number];
const TAB_LABELS: Record<Tab, string> = { about: "Sobre", requirements: "Requisitos" };


export default function GameDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { game, loading } = useGame(id);
  const [screenshot, setScreenshot] = useState(0);
  const [tab, setTab] = useState<Tab>("about");
  const [buying, setBuying] = useState(false);

  const { addToWishlist, removeFromWishlist, isInWishlist, isInLibrary, purchase, requireLogin, apiGames } = useStore();

  if (loading) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!game) {
    return (
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[20px] font-bold text-foreground mb-4">Jogo não encontrado</p>
          <Link href="/loja" className="px-5 py-2.5 rounded-xl text-[15px] font-semibold text-primary-foreground bg-primary">
            Voltar para a loja
          </Link>
        </div>
      </main>
    );
  }

  const inWishlist = isInWishlist(game.id);
  const inLibrary = isInLibrary(game.id);
  const relatedGames = apiGames
    .filter((g) => g.id !== game.id && g.genres.some((genre) => game.genres.includes(genre)))
    .slice(0, 4);
  const screenshots = game.screenshots.length > 0 ? game.screenshots : [game.coverImage];

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
    <main id="main-content" className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 lg:px-6">
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <li><Link href="/" className="hover:opacity-70 transition-opacity">Início</Link></li>
            <ChevronRight className="w-3.5 h-3.5" />
            <li><Link href="/loja" className="hover:opacity-70 transition-opacity">Loja</Link></li>
            <ChevronRight className="w-3.5 h-3.5" />
            <li className="text-foreground font-medium truncate max-w-[200px]">{game.title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-surface-base">
              <Image
                src={screenshots[screenshot]}
                alt={`${game.title} — screenshot ${screenshot + 1}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              {screenshots.length > 1 && (
                <>
                  <button
                    onClick={() => setScreenshot((p) => (p === 0 ? screenshots.length - 1 : p - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 bg-black/70 backdrop-blur-md"
                    aria-label="Screenshot anterior"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => setScreenshot((p) => (p === screenshots.length - 1 ? 0 : p + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 bg-black/70 backdrop-blur-md"
                    aria-label="Próximo screenshot"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </>
              )}
            </div>

            {screenshots.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {screenshots.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setScreenshot(i)}
                    className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 transition-all"
                    style={{ opacity: screenshot === i ? 1 : 0.45, outline: screenshot === i ? "2px solid var(--primary)" : "none", outlineOffset: "2px" }}
                  >
                    <Image src={s} alt={`Thumb ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-6">
              <div className="flex gap-1 rounded-xl p-1 mb-5 bg-surface-base">
                {TABS.map((key) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex-1 py-2 rounded-lg text-[14px] font-medium transition-colors ${tab === key ? "bg-surface-raised text-foreground" : "text-muted-foreground"}`}
                  >
                    {TAB_LABELS[key]}
                  </button>
                ))}
              </div>

              {tab === "about" && (
                <div className="space-y-4">
                  <div className="rounded-2xl p-6 bg-surface-raised">
                    <p className="text-[17px] font-bold text-foreground mb-3">Sobre o jogo</p>
                    <p className="text-[15px] leading-relaxed text-muted-foreground">
                      {game.longDescription || game.description}
                    </p>
                  </div>
                  {game.features.length > 0 && (
                    <div className="rounded-2xl p-5 bg-surface-raised">
                      <p className="text-[15px] font-semibold text-foreground mb-3">Recursos</p>
                      <div className="flex flex-wrap gap-2">
                        {game.features.map((f) => (
                          <span key={f} className="text-[13px] px-3 py-1 rounded-full bg-surface-inset text-muted-foreground">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === "requirements" && (
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { label: "Requisitos Mínimos", icon: Monitor, data: game.systemRequirements.minimum },
                    { label: "Recomendados", icon: Cpu, data: game.systemRequirements.recommended },
                  ].map(({ label, icon: Icon, data }) => (
                    <div key={label} className="rounded-2xl p-5 bg-surface-raised">
                      <p className="text-[15px] font-semibold text-foreground flex items-center gap-2 mb-4">
                        <Icon className="w-4 h-4 text-muted-foreground" /> {label}
                      </p>
                      <dl className="space-y-3">
                        {[["SO", data.os], ["Processador", data.processor], ["Memória", data.memory], ["Placa de vídeo", data.graphics], ["Armazenamento", data.storage]].map(([k, v]) =>
                          v ? (
                            <div key={k}>
                              <dt className="text-[12px] mb-0.5 text-text-tertiary">{k}</dt>
                              <dd className="text-[14px] font-medium text-foreground">{v}</dd>
                            </div>
                          ) : null
                        )}
                      </dl>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="rounded-2xl p-6 sticky top-20 bg-surface-raised">
              <h1 className="text-[22px] font-bold text-foreground mb-2">{game.title}</h1>

              <div className="flex items-center gap-2 mb-4">
                <Star className="w-4 h-4" style={{ fill: "oklch(0.80 0.18 85)", color: "oklch(0.80 0.18 85)" }} />
                <span className="text-[15px] font-semibold text-foreground">{game.rating}</span>
                <span className="text-[13px] text-muted-foreground">
                  ({game.reviewCount.toLocaleString("pt-BR")})
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {game.genres.map((g) => (
                  <span key={g} className="text-[12px] px-2.5 py-1 rounded-full bg-surface-inset text-muted-foreground">
                    {g}
                  </span>
                ))}
              </div>

              <div className="mb-5">
                {game.discount && (
                  <span className="inline-block text-[12px] font-bold px-2.5 py-1 rounded-lg mb-2 bg-success text-success-foreground">
                    -{game.discount}% de desconto
                  </span>
                )}
                <div className="flex items-baseline gap-3">
                  {game.originalPrice && (
                    <span className="text-[15px] line-through text-text-tertiary">{formatPrice(game.originalPrice)}</span>
                  )}
                  <span className={`text-[32px] font-bold ${game.price === 0 ? "text-success" : "text-primary"}`}>
                    {formatPrice(game.price)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {inLibrary ? (
                  <button className="w-full h-12 rounded-xl text-[15px] font-semibold text-primary-foreground bg-primary flex items-center justify-center gap-2 transition-opacity hover:opacity-80">
                    <Play className="w-4 h-4" /> Jogar agora
                  </button>
                ) : (
                  <button
                    onClick={handleBuy}
                    disabled={buying}
                    className="w-full h-12 rounded-xl text-[15px] font-semibold text-primary-foreground bg-primary flex items-center justify-center gap-2 transition-opacity disabled:opacity-70 hover:opacity-80"
                  >
                    {buying ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Comprar agora</>}
                  </button>
                )}
                {!inLibrary && (
                  <button
                    onClick={() => inWishlist ? removeFromWishlist(game.id) : requireLogin(() => addToWishlist(game.id))}
                    className={`w-full h-10 rounded-xl text-[14px] font-medium flex items-center justify-center gap-2 transition-opacity hover:opacity-70 bg-surface-inset ${inWishlist ? "text-destructive" : "text-muted-foreground"}`}
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
                    {inWishlist ? "Remover da lista" : "Lista de desejos"}
                  </button>
                )}
              </div>

              <dl className="mt-5 pt-5 space-y-3 border-t border-border">
                {[
                  { icon: Building, label: "Desenvolvedor", value: game.developer },
                  { icon: Tag, label: "Publicador", value: game.publisher },
                  { icon: Calendar, label: "Lançamento", value: game.releaseDate },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-text-tertiary" />
                    <div>
                      <dt className="text-[11px] text-muted-foreground">{label}</dt>
                      <dd className="text-[13px] font-medium text-foreground">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {relatedGames.length > 0 && (
          <section className="mt-12">
            <h2 className="text-[22px] font-bold tracking-tight text-foreground mb-5">Jogos semelhantes</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relatedGames.map((g) => <GameCard key={g.id} game={g} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
