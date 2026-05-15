"use client";

import { useState } from "react";
import Image from "next/image";
import { games } from "@/lib/games-data";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  User,
  Settings,
  Award,
  GamepadIcon,
  Users,
  Calendar,
  MapPin,
  Edit2,
  Camera,
  Star,
  Clock,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile, library, reviews } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const libraryGames = games.filter((g) => library.includes(g.id));
  const userReviews = reviews.filter((r) => r.userId === user?.id);

  const handleSaveProfile = () => {
    if (editedUser) {
      updateProfile(editedUser);
      setIsEditing(false);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Você não está logado</h1>
          <p className="text-muted-foreground">
            Faça login para ver seu perfil.
          </p>
        </div>
      </main>
    );
  }

  const xpToNextLevel = 10000;
  const xpProgress = (user.xp / xpToNextLevel) * 100;

  return (
    <main id="main-content" className="min-h-screen pt-20 lg:pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="glass rounded-3xl p-6 lg:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-24 h-24 lg:w-32 lg:h-32 border-4 border-primary/50">
                <AvatarImage src={user.avatar} alt={user.displayName} />
                <AvatarFallback className="text-3xl">
                  {user.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
                aria-label="Alterar foto de perfil"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold">
                  {user.displayName}
                </h1>
                <Badge variant="secondary" className="w-fit">
                  @{user.username}
                </Badge>
              </div>

              <p className="text-muted-foreground mb-4">{user.bio}</p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {user.country}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Membro desde {user.joinDate}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {user.friendCount} amigos
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GamepadIcon className="w-4 h-4" />
                  {libraryGames.length} jogos
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Edit2 className="w-4 h-4" />
                  Editar perfil
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Editar perfil</DialogTitle>
                  <DialogDescription>
                    Atualize suas informações de perfil
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nome de exibição</Label>
                    <Input
                      id="displayName"
                      value={editedUser?.displayName || ""}
                      onChange={(e) =>
                        setEditedUser((prev) =>
                          prev ? { ...prev, displayName: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografia</Label>
                    <Textarea
                      id="bio"
                      value={editedUser?.bio || ""}
                      onChange={(e) =>
                        setEditedUser((prev) =>
                          prev ? { ...prev, bio: e.target.value } : null
                        )
                      }
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      value={editedUser?.country || ""}
                      onChange={(e) =>
                        setEditedUser((prev) =>
                          prev ? { ...prev, country: e.target.value } : null
                        )
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProfile}>Salvar alterações</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Level Progress */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Nível {user.level}</div>
                  <div className="text-sm text-muted-foreground">
                    {user.xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Próximo nível
                </div>
                <div className="font-semibold">Nível {user.level + 1}</div>
              </div>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="games" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="games" className="gap-2">
              <GamepadIcon className="w-4 h-4" />
              Jogos ({libraryGames.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Avaliações ({userReviews.length})
            </TabsTrigger>
            <TabsTrigger value="badges" className="gap-2">
              <Award className="w-4 h-4" />
              Conquistas
            </TabsTrigger>
          </TabsList>

          {/* Games Tab */}
          <TabsContent value="games">
            {libraryGames.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-muted-foreground">
                  Nenhum jogo na biblioteca ainda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {libraryGames.map((game) => (
                  <div
                    key={game.id}
                    className="glass rounded-xl overflow-hidden group"
                  >
                    <div className="relative aspect-[460/215]">
                      <Image
                        src={game.coverImage}
                        alt={game.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm truncate">
                        {game.title}
                      </h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {Math.floor(Math.random() * 200)}h jogadas
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            {userReviews.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <p className="text-muted-foreground">
                  Você ainda não escreveu nenhuma avaliação.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userReviews.map((review) => {
                  const game = games.find((g) => g.id === review.gameId);
                  return (
                    <article
                      key={review.id}
                      className="glass rounded-2xl p-6"
                    >
                      <div className="flex items-start gap-4">
                        {game && (
                          <div className="relative w-20 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={game.coverImage}
                              alt={game.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold">
                              {game?.title || "Jogo"}
                            </span>
                            <Badge
                              variant={
                                review.rating === "positive"
                                  ? "default"
                                  : "destructive"
                              }
                              className="gap-1"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              {review.rating === "positive"
                                ? "Recomenda"
                                : "Não recomenda"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {review.hoursPlayed} horas jogadas • {review.date}
                          </p>
                          <p className="text-foreground">{review.content}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {user.badges.map((badge) => (
                <div
                  key={badge}
                  className="glass rounded-2xl p-6 text-center hover:bg-glass-hover transition-colors"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold">{badge}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Desbloqueado
                  </p>
                </div>
              ))}
              {/* Locked badges */}
              {["Completista", "Maratonista", "Crítico"].map((badge) => (
                <div
                  key={badge}
                  className="glass rounded-2xl p-6 text-center opacity-50"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold">{badge}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Bloqueado
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
