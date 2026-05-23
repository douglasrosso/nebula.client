"use client";

import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from "react";
import { useStore } from "@/lib/store";
import { friendsApi, messagesApi } from "@/lib/api";
import { useSignalRContext } from "@/contexts/signalr-context";
import type { ApiFriend, ApiMessage } from "@/lib/types";
import { AuthGuard } from "@/components/auth-guard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageCircle, UserPlus, Send, Check, CheckCheck, X,
  Loader2, Users, Search, Wifi, WifiOff,
} from "lucide-react";
import { toast } from "sonner";
import { avatarUrl, formatTime } from "@/lib/utils";

export default function ChatPage() {
  const { user, unreadByFriend, markConversationRead, unreadFriendRequests, clearFriendRequests } = useStore();

  // sidebar state
  const [tab, setTab] = useState<"friends" | "requests" | "add">("friends");
  const [friends, setFriends] = useState<ApiFriend[]>([]);
  const [requests, setRequests] = useState<ApiFriend[]>([]);

  // add-friend search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ApiFriend[]>([]);
  const [searching, setSearching] = useState(false);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // chat state
  const [selectedFriend, setSelectedFriend] = useState<ApiFriend | null>(null);
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedFriendRef = useRef<ApiFriend | null>(null);
  const bulkLoadRef = useRef(false);
  const [showDivider, setShowDivider] = useState(false);
  const dividerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const markReadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleIncoming = useCallback((msg: ApiMessage) => {
    const other = selectedFriendRef.current;
    if (!other) return;
    const isRelevant = msg.senderId === other.id || msg.receiverId === other.id;
    if (!isRelevant) return;
    setMessages((prev) => {
      if (prev.some((m) => m.id === msg.id)) return prev;
      return [...prev, msg];
    });
    if (msg.senderId === other.id) {
      const friendId = other.id;
      markConversationRead(friendId);
      if (markReadTimeoutRef.current) clearTimeout(markReadTimeoutRef.current);
      markReadTimeoutRef.current = setTimeout(() => {
        messagesApi.markRead(friendId).catch(() => {});
      }, 300);
    }
  }, [markConversationRead]);

  const handleMessagesRead = useCallback((readByUserId: string) => {
    setMessages((prev) => prev.map((m) =>
      m.receiverId === readByUserId ? { ...m, isRead: true } : m
    ));
  }, []);

  const handleFriendRequestReceived = useCallback((friend: ApiFriend) => {
    setRequests((prev) => {
      if (prev.some((r) => r.id === friend.id)) return prev;
      return [...prev, friend];
    });
    toast.info(`${friend.displayName} enviou uma solicitação de amizade!`);
  }, []);

  const handleFriendRequestAccepted = useCallback((friend: ApiFriend) => {
    setFriends((prev) => {
      if (prev.some((f) => f.id === friend.id)) return prev;
      return [...prev, { ...friend, status: "accepted" as const }];
    });
    toast.success(`${friend.displayName} aceitou sua solicitação!`);
  }, []);

  const { connected, sendMessage, onMessage, onMessagesRead, onFriendRequestReceived, onFriendRequestAccepted } = useSignalRContext();

  useEffect(() => onMessage(handleIncoming), [onMessage, handleIncoming]);
  useEffect(() => onMessagesRead(handleMessagesRead), [onMessagesRead, handleMessagesRead]);
  useEffect(() => onFriendRequestReceived(handleFriendRequestReceived), [onFriendRequestReceived, handleFriendRequestReceived]);
  useEffect(() => onFriendRequestAccepted(handleFriendRequestAccepted), [onFriendRequestAccepted, handleFriendRequestAccepted]);

  useEffect(() => { selectedFriendRef.current = selectedFriend; }, [selectedFriend]);

  useEffect(() => {
    const instant = bulkLoadRef.current;
    bulkLoadRef.current = false;
    messagesEndRef.current?.scrollIntoView({ behavior: instant ? "instant" : "smooth" });
  }, [messages]);

  useEffect(() => { reloadFriends(); }, []);

  useEffect(() => () => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    if (dividerTimeoutRef.current) clearTimeout(dividerTimeoutRef.current);
    if (markReadTimeoutRef.current) clearTimeout(markReadTimeoutRef.current);
  }, []);

  function handleSelectFriend(f: ApiFriend) {
    const hasUnread = (unreadByFriend[f.id] ?? 0) > 0;
    setSelectedFriend(f);
    markConversationRead(f.id);
    if (dividerTimeoutRef.current) clearTimeout(dividerTimeoutRef.current);
    if (markReadTimeoutRef.current) clearTimeout(markReadTimeoutRef.current);
    setShowDivider(hasUnread);
    if (hasUnread) {
      dividerTimeoutRef.current = setTimeout(() => setShowDivider(false), 5000);
    }
  }

  useEffect(() => {
    if (!selectedFriend) return;
    const friendId = selectedFriend.id;
    setMessages([]);
    setLoadingMsgs(true);
    messagesApi
      .getConversation(friendId)
      .then((msgs) => {
        bulkLoadRef.current = true;
        setMessages(msgs);
        if (msgs.some((m) => !m.isRead && m.senderId === friendId)) {
          messagesApi.markRead(friendId).catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoadingMsgs(false));
  }, [selectedFriend?.id]);

  async function reloadFriends() {
    try {
      const [f, r] = await Promise.all([friendsApi.list(), friendsApi.requests()]);
      setFriends(f);
      setRequests(r);
    } catch {}
  }

  function handleSearchInput(val: string) {
    setSearchQuery(val);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);

    if (val.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    searchDebounce.current = setTimeout(async () => {
      setSearching(true);
      try {
        setSearchResults(await friendsApi.search(val.trim()));
      } catch {}
      setSearching(false);
    }, 350);
  }

  async function handleSendRequest(target: ApiFriend) {
    try {
      await friendsApi.add(target.id);
      setSearchResults((prev) =>
        prev.map((r) => r.id === target.id ? { ...r, status: "pending_sent" } : r)
      );
      toast.success(`Solicitação enviada para ${target.displayName}!`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao enviar solicitação.");
    }
  }

  async function handleAccept(requester: ApiFriend) {
    try {
      await friendsApi.accept(requester.id);
      setRequests((prev) => prev.filter((r) => r.id !== requester.id));
      setFriends((prev) => [...prev, { ...requester, status: "accepted" }]);
      toast.success(`${requester.displayName} agora é seu amigo!`);
    } catch {
      toast.error("Erro ao aceitar solicitação.");
    }
  }

  async function handleDecline(requester: ApiFriend) {
    try {
      await friendsApi.remove(requester.id);
      setRequests((prev) => prev.filter((r) => r.id !== requester.id));
    } catch {
      toast.error("Erro ao recusar solicitação.");
    }
  }

  async function handleRemoveFriend(friendId: string) {
    try {
      await friendsApi.remove(friendId);
      setFriends((prev) => prev.filter((f) => f.id !== friendId));
      markConversationRead(friendId);
      if (selectedFriend?.id === friendId) setSelectedFriend(null);
      toast.success("Amigo removido.");
    } catch {
      toast.error("Erro ao remover amigo.");
    }
  }

  const { firstUnreadIdx, unreadCount } = useMemo(() => {
    if (!showDivider || !selectedFriend) return { firstUnreadIdx: -1, unreadCount: 0 };
    const friendId = selectedFriend.id;
    let firstIdx = -1;
    let count = 0;
    for (const [i, m] of messages.entries()) {
      if (!m.isRead && m.senderId === friendId) {
        if (firstIdx === -1) firstIdx = i;
        count++;
      }
    }
    return { firstUnreadIdx: firstIdx, unreadCount: count };
  }, [messages, showDivider, selectedFriend?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSend() {
    if (!input.trim() || !selectedFriend || sending) return;
    const content = input.trim();
    setInput("");
    setSending(true);
    try {
      await sendMessage(selectedFriend.id, content);
      // backend echoes the sent message back via ReceiveMessage, so no local push needed
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao enviar mensagem.");
      setInput(content);
    } finally {
      setSending(false);
    }
  }
  return (
    <AuthGuard>
      <main id="main-content" className="min-h-screen pt-16 pb-0">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <div className="flex h-[calc(100vh-7rem)] rounded-2xl overflow-hidden border border-border bg-surface-base">

            {/* ── Sidebar ───────────────────────────────────────── */}
            <div className="w-72 flex-shrink-0 flex flex-col border-r border-border">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
                <h1 className="text-[17px] font-bold text-foreground">Chat</h1>
                <span
                  title={connected ? "Conectado" : "Desconectado"}
                  className={connected ? "text-success" : "text-muted-foreground"}
                >
                  {connected
                    ? <Wifi className="w-4 h-4" />
                    : <WifiOff className="w-4 h-4" />}
                </span>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border shrink-0">
                {(
                  [
                    { key: "friends",  label: "Amigos",    badge: 0                    },
                    { key: "requests", label: "Pedidos",   badge: unreadFriendRequests },
                    { key: "add",      label: "Adicionar", badge: 0                    },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.key}
                    onClick={() => {
                      setTab(t.key);
                      if (t.key === "requests") clearFriendRequests();
                    }}
                    className={`flex-1 py-2.5 text-[11px] font-semibold transition-colors ${
                      tab === t.key
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                    {t.badge > 0 && (
                      <span className="ml-1 text-[10px] bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                        {t.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto">

                {/* FRIENDS */}
                {tab === "friends" && (
                  <>
                    {friends.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-[13px] gap-2">
                        <Users className="w-8 h-8 opacity-30" />
                        Nenhum amigo ainda.
                      </div>
                    ) : (
                      friends.map((f) => {
                        const friendUnread = unreadByFriend[f.id] ?? 0;
                        return (
                          <button
                            key={f.id}
                            onClick={() => handleSelectFriend(f)}
                            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                              selectedFriend?.id === f.id
                                ? "bg-primary/10"
                                : "hover:bg-surface-raised"
                            }`}
                          >
                            <Avatar className="w-9 h-9 shrink-0">
                              <AvatarImage src={avatarUrl(f)} alt={f.displayName} />
                              <AvatarFallback>{f.displayName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-foreground truncate">{f.displayName}</p>
                              <p className="text-[11px] text-muted-foreground truncate">@{f.username}</p>
                            </div>
                            {friendUnread > 0 && (
                              <span className="shrink-0 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
                                {friendUnread > 99 ? "99+" : friendUnread}
                              </span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </>
                )}

                {/* REQUESTS */}
                {tab === "requests" && (
                  <>
                    {requests.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-[13px] text-muted-foreground">
                        Nenhum pedido pendente.
                      </div>
                    ) : (
                      requests.map((req) => (
                        <div key={req.id} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
                          <Avatar className="w-9 h-9 shrink-0">
                            <AvatarImage src={avatarUrl(req)} alt={req.displayName} />
                            <AvatarFallback>{req.displayName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-foreground truncate">{req.displayName}</p>
                            <p className="text-[11px] text-muted-foreground truncate">@{req.username}</p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => handleAccept(req)}
                              className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                              aria-label="Aceitar"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDecline(req)}
                              className="p-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                              aria-label="Recusar"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )}

                {/* ADD FRIEND */}
                {tab === "add" && (
                  <div className="flex flex-col">
                    <div className="p-3 border-b border-border">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                        <input
                          type="text"
                          placeholder="Buscar por nome ou e-mail..."
                          value={searchQuery}
                          onChange={(e) => handleSearchInput(e.target.value)}
                          className="w-full h-9 pl-9 pr-3 rounded-lg text-[13px] bg-surface-raised border border-border outline-none text-foreground placeholder:text-text-tertiary"
                          autoFocus
                        />
                      </div>
                    </div>

                    {searching && (
                      <div className="flex justify-center py-6">
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      </div>
                    )}

                    {!searching && searchQuery.trim().length < 2 && (
                      <p className="p-5 text-center text-[12px] text-muted-foreground">
                        Digite ao menos 2 caracteres.
                      </p>
                    )}

                    {!searching && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                      <p className="p-5 text-center text-[12px] text-muted-foreground">
                        Nenhum usuário encontrado.
                      </p>
                    )}

                    {!searching && searchResults.map((r) => (
                      <div key={r.id} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
                        <Avatar className="w-9 h-9 shrink-0">
                          <AvatarImage src={avatarUrl(r)} alt={r.displayName} />
                          <AvatarFallback>{r.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-foreground truncate">{r.displayName}</p>
                          <p className="text-[11px] text-muted-foreground truncate">@{r.username}</p>
                        </div>

                        {/* status badge / action */}
                        {r.status === "accepted" && (
                          <span className="shrink-0 text-[11px] px-2 py-1 rounded-lg bg-surface-inset text-muted-foreground">
                            Amigo
                          </span>
                        )}
                        {r.status === "pending_sent" && (
                          <span className="shrink-0 text-[11px] px-2 py-1 rounded-lg bg-primary/10 text-primary">
                            Enviado
                          </span>
                        )}
                        {r.status === "pending_received" && (
                          <button
                            onClick={() => handleAccept(r)}
                            className="shrink-0 flex items-center gap-1 text-[11px] px-2 py-1 rounded-lg bg-success/10 text-success hover:bg-success hover:text-white transition-colors"
                          >
                            <Check className="w-3 h-3" /> Aceitar
                          </button>
                        )}
                        {r.status === "none" && (
                          <button
                            onClick={() => handleSendRequest(r)}
                            className="shrink-0 p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                            aria-label={`Adicionar ${r.displayName}`}
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Chat area ─────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">
              {selectedFriend ? (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-border shrink-0">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={avatarUrl(selectedFriend)} alt={selectedFriend.displayName} />
                        <AvatarFallback>{selectedFriend.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[15px] font-semibold text-foreground leading-tight">{selectedFriend.displayName}</p>
                        <p className="text-[12px] text-muted-foreground">@{selectedFriend.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFriend(selectedFriend.id)}
                      className="text-[12px] text-destructive hover:underline shrink-0"
                    >
                      Remover amigo
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5">
                    {loadingMsgs && messages.length === 0 ? (
                      <div className="flex justify-center pt-10">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : messages.length === 0 ? (
                      <p className="text-center py-12 text-[14px] text-muted-foreground">
                        Nenhuma mensagem ainda. Diga olá! 👋
                      </p>
                    ) : (
                      <>
                        {messages.map((msg, idx) => {
                          const isMe = msg.senderId === user?.id;
                          return (
                            <Fragment key={msg.id}>
                              {firstUnreadIdx !== -1 && idx === firstUnreadIdx && (
                                <div className="flex items-center gap-2 py-1">
                                  <div className="flex-1 h-px bg-primary/30" />
                                  <span className="text-[11px] text-primary font-medium shrink-0">
                                    {unreadCount === 1 ? "1 mensagem não lida" : `${unreadCount} mensagens não lidas`}
                                  </span>
                                  <div className="flex-1 h-px bg-primary/30" />
                                </div>
                              )}
                              <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                <div
                                  className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed ${
                                    isMe
                                      ? "bg-primary text-primary-foreground rounded-br-sm"
                                      : "bg-surface-raised text-foreground rounded-bl-sm"
                                  }`}
                                >
                                  <p className="break-words">{msg.content}</p>
                                  <p className={`flex items-center gap-1 text-[10px] mt-1 ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                                    {formatTime(msg.sentAt)}
                                    {isMe && (
                                      msg.isRead
                                        ? <CheckCheck className="w-3 h-3" />
                                        : <Check className="w-3 h-3" />
                                    )}
                                  </p>
                                </div>
                              </div>
                            </Fragment>
                          );
                        })}
                      </>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="px-5 py-4 border-t border-border shrink-0">
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        placeholder={connected ? "Digite uma mensagem..." : "Conectando..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        disabled={!connected}
                        className="flex-1 h-11 px-4 rounded-xl text-[14px] bg-surface-raised border border-border outline-none text-foreground placeholder:text-text-tertiary disabled:opacity-50"
                      />
                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || !connected || sending}
                        className="h-11 w-11 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:opacity-80 transition-opacity disabled:opacity-40 shrink-0"
                        aria-label="Enviar"
                      >
                        {sending
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-3">
                  <MessageCircle className="w-12 h-12 text-muted-foreground opacity-30" />
                  <p className="text-[17px] font-semibold text-foreground">Selecione um amigo</p>
                  <p className="text-[14px] text-muted-foreground">
                    Escolha um amigo na lista para começar a conversa.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
