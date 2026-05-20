"use client";

import { useState } from "react";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { useGames } from "@/lib/hooks/useGames";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Award, GamepadIcon, Users, Calendar, MapPin, Edit2, ThumbsUp, MessageSquare, Camera } from "lucide-react";
import type { ApiUser } from "@/lib/types";

const TAB_LABELS = [
  { key: "games", label: "Jogos", icon: GamepadIcon },
  { key: "reviews", label: "Avaliações", icon: MessageSquare },
  { key: "badges", label: "Conquistas", icon: Award },
] as const;

export default function ProfilePage() {
  const { user, updateProfile, library, reviews, apiGames } = useStore();
  const [activeTab, setActiveTab] = useState<"games" | "reviews" | "badges">("games");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<ApiUser | null>(user);

  useGames({ pageSize: 200 });

  const libraryGames = apiGames.filter((g) => library.includes(g.id));
  const userReviews = reviews.filter((r) => r.userId === user?.id);

  const handleSave = async () => {
    if (editedUser) { await updateProfile(editedUser); setIsEditing(false); }
  };

  if (!user) return null;

  const xpProgress = Math.min((user.xp / 10000) * 100, 100);
  const joinDate = new Date(user.createdAt).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <main id="main-content" className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 lg:px-6">

        <div className="rounded-2xl p-6 lg:p-8 mb-6 bg-surface-raised">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative flex-shrink-0">
              <Avatar className="w-24 h-24 lg:w-28 lg:h-28">
                <AvatarImage
                  src={user.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  alt={user.displayName}
                />
                <AvatarFallback className="text-2xl bg-surface-inset text-foreground">
                  {user.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 bg-primary"
                aria-label="Alterar foto"
              >
                <Camera className="w-3.5 h-3.5 text-primary-foreground" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-1">
                <div>
                  <h1 className="text-[24px] lg:text-[28px] font-bold text-foreground">{user.displayName}</h1>
                  <p className="text-[14px] text-text-tertiary">@{user.username}</p>
                </div>
                <Dialog open={isEditing} onOpenChange={(o) => { setIsEditing(o); if (o) setEditedUser(user); }}>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-opacity hover:opacity-70 flex-shrink-0 bg-surface-inset text-muted-foreground">
                      <Edit2 className="w-3.5 h-3.5" /> Editar
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-surface-raised border border-border">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Editar perfil</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-1.5">
                        <Label className="text-[13px] text-muted-foreground">Nome de exibição</Label>
                        <Input
                          value={editedUser?.displayName ?? ""}
                          onChange={(e) => setEditedUser((p) => p ? { ...p, displayName: e.target.value } : null)}
                          className="bg-surface-inset border-0 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[13px] text-muted-foreground">Biografia</Label>
                        <Textarea
                          value={editedUser?.bio ?? ""}
                          onChange={(e) => setEditedUser((p) => p ? { ...p, bio: e.target.value } : null)}
                          rows={3}
                          className="bg-surface-inset border-0 text-foreground"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[13px] text-muted-foreground">País</Label>
                        <Input
                          value={editedUser?.country ?? ""}
                          onChange={(e) => setEditedUser((p) => p ? { ...p, country: e.target.value } : null)}
                          className="bg-surface-inset border-0 text-foreground"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-xl text-[14px] font-medium transition-opacity hover:opacity-70 bg-surface-inset text-muted-foreground"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-xl text-[14px] font-semibold text-primary-foreground bg-primary transition-opacity hover:opacity-80"
                      >
                        Salvar
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {user.bio && (
                <p className="text-[15px] mt-2 mb-4 text-muted-foreground">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-[13px] text-muted-foreground">
                {user.country && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{user.country}</span>}
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Membro desde {joinDate}</span>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{user.friendCount} amigos</span>
                <span className="flex items-center gap-1.5"><GamepadIcon className="w-3.5 h-3.5" />{libraryGames.length} jogos</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[14px] font-semibold text-foreground">Nível {user.level}</span>
              <span className="text-[12px] text-text-tertiary">
                {user.xp.toLocaleString()} / 10.000 XP
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden bg-border">
              <div
                className="h-full rounded-full transition-all bg-primary"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-1 mb-6 rounded-xl p-1 bg-surface-base">
          {TAB_LABELS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[14px] font-medium transition-colors ${activeTab === key ? "bg-surface-raised text-foreground" : "text-muted-foreground"}`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
              {key === "games" && ` (${libraryGames.length})`}
              {key === "reviews" && ` (${userReviews.length})`}
            </button>
          ))}
        </div>

        {activeTab === "games" && (
          libraryGames.length === 0 ? (
            <div className="rounded-2xl p-12 text-center bg-surface-base">
              <p className="text-[15px] text-muted-foreground">Nenhum jogo na biblioteca ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {libraryGames.map((game) => (
                <div key={game.id} className="rounded-xl overflow-hidden bg-surface-raised">
                  <div className="relative aspect-[460/215]">
                    <Image src={game.coverImage} alt={game.title} fill className="object-cover" sizes="(max-width: 640px) 50vw, 16vw" />
                  </div>
                  <div className="p-2.5">
                    <p className="text-[12px] font-semibold text-foreground truncate">{game.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === "reviews" && (
          userReviews.length === 0 ? (
            <div className="rounded-2xl p-12 text-center bg-surface-base">
              <p className="text-[15px] text-muted-foreground">Você ainda não escreveu nenhuma avaliação.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userReviews.map((review) => {
                const game = apiGames.find((g) => g.id === review.gameId);
                return (
                  <article key={review.id} className="p-5 rounded-2xl bg-surface-raised">
                    <div className="flex items-start gap-4">
                      {game && (
                        <div className="relative w-16 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={game.coverImage} alt={game.title} fill className="object-cover" sizes="64px" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-[15px] font-semibold text-foreground">{game?.title ?? "Jogo"}</span>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${review.rating === "positive" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}
                          >
                            {review.rating === "positive" ? "Recomenda" : "Não recomenda"}
                          </span>
                        </div>
                        <p className="text-[12px] mb-2 text-text-tertiary">
                          {review.hoursPlayed}h jogadas · {review.date}
                        </p>
                        <p className="text-[14px] text-foreground">{review.content}</p>
                        <div className="flex gap-4 mt-3 text-[12px] text-muted-foreground">
                          <button className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                            <ThumbsUp className="w-3.5 h-3.5" /> {review.helpful} úteis
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )
        )}

        {activeTab === "badges" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {(user.badges.length > 0 ? user.badges : ["Explorador", "Comprador"]).map((badge) => (
              <div key={badge} className="rounded-2xl p-5 text-center bg-surface-raised">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-primary/15">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <p className="text-[14px] font-semibold text-foreground">{badge}</p>
                <p className="text-[12px] mt-0.5 text-muted-foreground">Desbloqueado</p>
              </div>
            ))}
            {["Completista", "Maratonista", "Crítico"].map((badge) => (
              <div key={badge} className="rounded-2xl p-5 text-center opacity-40 bg-surface-raised">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-surface-inset">
                  <Award className="w-6 h-6 text-text-tertiary" />
                </div>
                <p className="text-[14px] font-semibold text-foreground">{badge}</p>
                <p className="text-[12px] mt-0.5 text-text-tertiary">Bloqueado</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
