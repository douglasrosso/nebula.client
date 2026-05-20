"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGame } from "@/lib/hooks/useGames";
import { useStore } from "@/lib/store";
import { reviewsApi } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { GameCard } from "@/components/game-card";
import {
  Star, ShoppingCart, Heart, Check, Play, ThumbsUp, ThumbsDown,
  ChevronLeft, ChevronRight, Monitor, Cpu, Calendar, Building, Tag, Loader2,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const TAB_KEYS = ["about", "reviews", "requirements"] as const;
const TAB_LABELS: Record<typeof TAB_KEYS[number], string> = {
  about: "Sobre",
  reviews: "Avaliações",
  requirements: "Requisitos",
};

function formatPrice(price: number) {
  if (price === 0) return "Gratuito";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
}

export default function GameDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { game, loading } = useGame(id);
  const [screenshot, setScreenshot] = useState(0);
  const [tab, setTab] = useState<typeof TAB_KEYS[number]>("about");
  const [reviewType, setReviewType] = useState<"positive" | "negative" | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { addToCart, cart, addToWishlist, removeFromWishlist, isInWishlist, isInLibrary, reviews, addReview, user, apiGames, requireLogin } = useStore();

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

  const inCart = cart.some((item) => item.game.id === game.id);
  const inWishlist = isInWishlist(game.id);
  const inLibrary = isInLibrary(game.id);
  const gameReviews = reviews.filter((r) => r.gameId === game.id);
  const relatedGames = apiGames.filter((g) => g.id !== game.id && g.genres.some((genre) => game.genres.includes(genre))).slice(0, 4);
  const screenshots = game.screenshots.length > 0 ? game.screenshots : [game.coverImage];

  const handleSubmitReview = async () => {
    if (!reviewType || !reviewText.trim()) return;
    if (!requireLogin(() => handleSubmitReview())) return;
    if (!user) return;
    setSubmitting(true);
    try {
      await reviewsApi.create({ gameId: game.id, rating: reviewType, hoursPlayed: 0, content: reviewText });
      addReview({
        id: `r${Date.now()}`,
        gameId: game.id,
        userId: user.id,
        userName: user.displayName,
        userAvatar: user.avatar ?? "",
        rating: reviewType,
        hoursPlayed: 0,
        content: reviewText,
        date: new Date().toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" }),
        helpful: 0,
        funny: 0,
      });
      setReviewText("");
      setReviewType(null);
    } catch { /* add locally even if API fails */ } finally {
      setSubmitting(false);
    }
  };

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
                {TAB_KEYS.map((key) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex-1 py-2 rounded-lg text-[14px] font-medium transition-colors ${tab === key ? "bg-surface-raised text-foreground" : "text-muted-foreground"}`}
                  >
                    {TAB_LABELS[key]}
                    {key === "reviews" && ` (${gameReviews.length})`}
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

              {tab === "reviews" && (
                <div className="space-y-4">
                  <div className="rounded-2xl p-5 bg-surface-raised">
                    <div className="flex items-center gap-6 mb-4">
                      <div className="text-center">
                        <p className="text-[34px] font-bold text-success">{game.positivePercentage}%</p>
                        <p className="text-[12px] text-muted-foreground">positivas</p>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 rounded-full overflow-hidden mb-1.5 bg-border">
                          <div className="h-full rounded-full bg-success" style={{ width: `${game.positivePercentage}%` }} />
                        </div>
                        <p className="text-[13px] text-muted-foreground">
                          {game.reviewCount.toLocaleString("pt-BR")} avaliações
                        </p>
                      </div>
                    </div>

                    {inLibrary && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-[15px] font-semibold text-foreground mb-3">Sua avaliação</p>
                        <div className="flex gap-2 mb-3">
                          {(["positive", "negative"] as const).map((type) => (
                            <button
                              key={type}
                              onClick={() => setReviewType(type)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[14px] font-medium transition-all ${
                                reviewType === type
                                  ? (type === "positive" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive")
                                  : "bg-surface-inset text-muted-foreground"
                              }`}
                            >
                              {type === "positive" ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
                              {type === "positive" ? "Recomendo" : "Não recomendo"}
                            </button>
                          ))}
                        </div>
                        <Textarea
                          placeholder="Conte sua experiência com o jogo..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          className="mb-3 min-h-24 text-foreground bg-surface-inset border-0"
                        />
                        <button
                          onClick={handleSubmitReview}
                          disabled={!reviewType || !reviewText.trim() || submitting}
                          className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-primary-foreground bg-primary transition-opacity disabled:opacity-40 hover:opacity-80"
                        >
                          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publicar avaliação"}
                        </button>
                      </div>
                    )}
                  </div>

                  {gameReviews.length === 0 ? (
                    <div className="rounded-2xl p-8 text-center bg-surface-raised">
                      <p className="text-[15px] text-muted-foreground">
                        Ainda não há avaliações.{!inLibrary && " Compre o jogo para deixar a sua!"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {gameReviews.map((review) => (
                        <article key={review.id} className="rounded-2xl p-5 bg-surface-raised">
                          <div className="flex items-start gap-3">
                            <Avatar className="w-10 h-10 flex-shrink-0">
                              <AvatarImage src={review.userAvatar} alt={review.userName} />
                              <AvatarFallback className="bg-surface-inset text-foreground">{review.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[15px] font-semibold text-foreground">{review.userName}</span>
                                <span
                                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${review.rating === "positive" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}
                                >
                                  {review.rating === "positive" ? "Recomenda" : "Não recomenda"}
                                </span>
                              </div>
                              <p className="text-[12px] mb-2 text-text-tertiary">
                                {review.hoursPlayed}h · {review.date}
                              </p>
                              <p className="text-[14px] leading-relaxed text-foreground">{review.content}</p>
                              <div className="flex gap-4 mt-3 text-[12px] text-muted-foreground">
                                <button className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                                  <ThumbsUp className="w-3.5 h-3.5" /> {review.helpful} úteis
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
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
                  <>
                    <button
                      onClick={() => requireLogin(() => addToCart(game))}
                      disabled={inCart}
                      className="w-full h-12 rounded-xl text-[15px] font-semibold text-primary-foreground bg-primary flex items-center justify-center gap-2 transition-opacity disabled:opacity-70 hover:opacity-80"
                    >
                      {inCart ? <><Check className="w-4 h-4" /> No carrinho</> : <><ShoppingCart className="w-4 h-4" /> Adicionar ao carrinho</>}
                    </button>
                    {inCart && (
                      <Link
                        href="/carrinho"
                        className="block w-full h-10 rounded-xl text-[14px] font-medium text-center leading-10 transition-opacity hover:opacity-70 bg-surface-inset text-muted-foreground"
                      >
                        Ver carrinho
                      </Link>
                    )}
                  </>
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
