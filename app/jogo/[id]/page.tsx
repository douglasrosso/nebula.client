"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { games } from "@/lib/games-data";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  ShoppingCart,
  Heart,
  Check,
  Play,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Cpu,
  HardDrive,
  Users,
  Calendar,
  Building,
  Tag,
} from "lucide-react";
import { GameCard } from "@/components/game-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GameDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const game = games.find((g) => g.id === id);
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [reviewType, setReviewType] = useState<"positive" | "negative" | null>(null);
  const [reviewText, setReviewText] = useState("");

  const {
    addToCart,
    cart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isInLibrary,
    addToLibrary,
    reviews,
    addReview,
    user,
  } = useStore();

  if (!game) {
    return (
      <main className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Jogo não encontrado</h1>
          <Link href="/loja">
            <Button>Voltar para a loja</Button>
          </Link>
        </div>
      </main>
    );
  }

  const inCart = cart.some((item) => item.game.id === game.id);
  const inWishlist = isInWishlist(game.id);
  const inLibrary = isInLibrary(game.id);
  const gameReviews = reviews.filter((r) => r.gameId === game.id);
  const relatedGames = games
    .filter((g) => g.id !== game.id && g.genres.some((genre) => game.genres.includes(genre)))
    .slice(0, 4);

  const screenshots = game.screenshots.length > 0 
    ? game.screenshots 
    : [game.coverImage];

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratuito";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleSubmitReview = () => {
    if (!reviewType || !reviewText.trim() || !user) return;

    const newReview = {
      id: `r${Date.now()}`,
      gameId: game.id,
      userId: user.id,
      userName: user.displayName,
      userAvatar: user.avatar,
      rating: reviewType,
      hoursPlayed: Math.floor(Math.random() * 100) + 10,
      content: reviewText,
      date: new Date().toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      helpful: 0,
      funny: 0,
    };

    addReview(newReview);
    setReviewText("");
    setReviewType(null);
  };

  return (
    <main id="main-content" className="min-h-screen pt-20 lg:pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Início
              </Link>
            </li>
            <ChevronRight className="w-4 h-4" />
            <li>
              <Link href="/loja" className="hover:text-foreground transition-colors">
                Loja
              </Link>
            </li>
            <ChevronRight className="w-4 h-4" />
            <li className="text-foreground font-medium">{game.title}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Media */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Screenshot */}
            <div className="relative aspect-video rounded-2xl overflow-hidden glass">
              <Image
                src={screenshots[currentScreenshot]}
                alt={`${game.title} - Screenshot ${currentScreenshot + 1}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              
              {screenshots.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentScreenshot((prev) =>
                        prev === 0 ? screenshots.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-glass-hover transition-colors"
                    aria-label="Screenshot anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentScreenshot((prev) =>
                        prev === screenshots.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-glass-hover transition-colors"
                    aria-label="Próximo screenshot"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {screenshots.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {screenshots.map((screenshot, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentScreenshot(index)}
                    className={`relative w-24 h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                      currentScreenshot === index
                        ? "ring-2 ring-primary"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`Ver screenshot ${index + 1}`}
                  >
                    <Image
                      src={screenshot}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="about" className="mt-8">
              <TabsList className="glass w-full justify-start gap-2 p-1 rounded-xl">
                <TabsTrigger value="about" className="rounded-lg">
                  Sobre
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-lg">
                  Avaliações ({gameReviews.length})
                </TabsTrigger>
                <TabsTrigger value="requirements" className="rounded-lg">
                  Requisitos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6 space-y-6">
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4">Sobre o jogo</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {game.longDescription}
                  </p>
                </div>

                {/* Features */}
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">Recursos</h3>
                  <div className="flex flex-wrap gap-2">
                    {game.features.map((feature) => (
                      <Badge
                        key={feature}
                        variant="secondary"
                        className="px-3 py-1"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 space-y-6">
                {/* Review Summary */}
                <div className="glass rounded-2xl p-6">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-success mb-1">
                        {game.positivePercentage}%
                      </div>
                      <p className="text-sm text-muted-foreground">Positivas</p>
                    </div>
                    <div className="flex-1">
                      <Progress
                        value={game.positivePercentage}
                        className="h-3 mb-2"
                      />
                      <p className="text-sm text-muted-foreground">
                        Baseado em {game.reviewCount.toLocaleString("pt-BR")} avaliações
                      </p>
                    </div>
                  </div>

                  {/* Write Review */}
                  {inLibrary && (
                    <div className="border-t border-border pt-6">
                      <h3 className="font-semibold mb-4">Escreva sua avaliação</h3>
                      <div className="flex gap-4 mb-4">
                        <Button
                          variant={reviewType === "positive" ? "default" : "outline"}
                          onClick={() => setReviewType("positive")}
                          className="gap-2"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Recomendo
                        </Button>
                        <Button
                          variant={reviewType === "negative" ? "destructive" : "outline"}
                          onClick={() => setReviewType("negative")}
                          className="gap-2"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          Não recomendo
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Conte sua experiência com o jogo..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="mb-4 min-h-24"
                      />
                      <Button
                        onClick={handleSubmitReview}
                        disabled={!reviewType || !reviewText.trim()}
                      >
                        Publicar avaliação
                      </Button>
                    </div>
                  )}
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {gameReviews.length === 0 ? (
                    <div className="glass rounded-2xl p-8 text-center">
                      <p className="text-muted-foreground">
                        Ainda não há avaliações para este jogo.
                        {!inLibrary && " Compre o jogo para deixar a sua!"}
                      </p>
                    </div>
                  ) : (
                    gameReviews.map((review) => (
                      <article
                        key={review.id}
                        className="glass rounded-2xl p-6"
                      >
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={review.userAvatar}
                              alt={review.userName}
                            />
                            <AvatarFallback>
                              {review.userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold">
                                {review.userName}
                              </span>
                              <Badge
                                variant={
                                  review.rating === "positive"
                                    ? "default"
                                    : "destructive"
                                }
                                className="gap-1"
                              >
                                {review.rating === "positive" ? (
                                  <ThumbsUp className="w-3 h-3" />
                                ) : (
                                  <ThumbsDown className="w-3 h-3" />
                                )}
                                {review.rating === "positive"
                                  ? "Recomenda"
                                  : "Não recomenda"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {review.hoursPlayed} horas jogadas • {review.date}
                            </p>
                            <p className="text-foreground leading-relaxed">
                              {review.content}
                            </p>
                            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                              <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                                {review.helpful} úteis
                              </button>
                              <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                                Engraçado ({review.funny})
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="requirements" className="mt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Minimum */}
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-muted-foreground" />
                      Requisitos Mínimos
                    </h3>
                    <dl className="space-y-3 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Sistema Operacional</dt>
                        <dd className="font-medium">{game.systemRequirements.minimum.os}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Processador</dt>
                        <dd className="font-medium">{game.systemRequirements.minimum.processor}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Memória</dt>
                        <dd className="font-medium">{game.systemRequirements.minimum.memory}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Placa de vídeo</dt>
                        <dd className="font-medium">{game.systemRequirements.minimum.graphics}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Armazenamento</dt>
                        <dd className="font-medium">{game.systemRequirements.minimum.storage}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Recommended */}
                  <div className="glass rounded-2xl p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-primary" />
                      Requisitos Recomendados
                    </h3>
                    <dl className="space-y-3 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Sistema Operacional</dt>
                        <dd className="font-medium">{game.systemRequirements.recommended.os}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Processador</dt>
                        <dd className="font-medium">{game.systemRequirements.recommended.processor}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Memória</dt>
                        <dd className="font-medium">{game.systemRequirements.recommended.memory}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Placa de vídeo</dt>
                        <dd className="font-medium">{game.systemRequirements.recommended.graphics}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Armazenamento</dt>
                        <dd className="font-medium">{game.systemRequirements.recommended.storage}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Info & Purchase */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <div className="glass rounded-2xl p-6 sticky top-28">
              <h1 className="text-2xl font-bold mb-2">{game.title}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-warning text-warning" />
                  <span className="font-semibold">{game.rating}</span>
                </div>
                <span className="text-muted-foreground">
                  ({game.reviewCount.toLocaleString("pt-BR")} avaliações)
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {game.genres.map((genre) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>

              {/* Price */}
              <div className="mb-6">
                {game.discount && (
                  <Badge className="bg-success text-success-foreground mb-2">
                    -{game.discount}% de desconto
                  </Badge>
                )}
                <div className="flex items-baseline gap-3">
                  {game.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(game.originalPrice)}
                    </span>
                  )}
                  <span className={`text-3xl font-bold ${game.price === 0 ? "text-success" : "text-primary"}`}>
                    {formatPrice(game.price)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {inLibrary ? (
                  <Button size="lg" className="w-full gap-2 h-14 text-lg">
                    <Play className="w-5 h-5" />
                    Jogar agora
                  </Button>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="w-full gap-2 h-14 text-lg"
                      onClick={() => addToCart(game)}
                      disabled={inCart}
                    >
                      {inCart ? (
                        <>
                          <Check className="w-5 h-5" />
                          No carrinho
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Adicionar ao carrinho
                        </>
                      )}
                    </Button>
                    {inCart && (
                      <Link href="/carrinho" className="block">
                        <Button variant="outline" size="lg" className="w-full h-12">
                          Ver carrinho
                        </Button>
                      </Link>
                    )}
                  </>
                )}
                
                {!inLibrary && (
                  <Button
                    variant="outline"
                    size="lg"
                    className={`w-full gap-2 h-12 ${inWishlist ? "text-destructive border-destructive/50" : ""}`}
                    onClick={() =>
                      inWishlist
                        ? removeFromWishlist(game.id)
                        : addToWishlist(game.id)
                    }
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
                    {inWishlist ? "Remover da lista de desejos" : "Adicionar à lista de desejos"}
                  </Button>
                )}
              </div>

              {/* Game Info */}
              <dl className="mt-6 pt-6 border-t border-border space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <dt className="text-muted-foreground">Desenvolvedor</dt>
                    <dd className="font-medium">{game.developer}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <dt className="text-muted-foreground">Publicador</dt>
                    <dd className="font-medium">{game.publisher}</dd>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <dt className="text-muted-foreground">Data de lançamento</dt>
                    <dd className="font-medium">{game.releaseDate}</dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Related Games */}
        {relatedGames.length > 0 && (
          <section className="mt-12" aria-labelledby="related-games">
            <h2 id="related-games" className="text-xl font-bold mb-6">
              Jogos semelhantes
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedGames.map((relatedGame) => (
                <GameCard key={relatedGame.id} game={relatedGame} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
