"use client";

import { useState, useEffect, useRef, useCallback, useMemo, Fragment } from "react";
import styled from "styled-components";
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

/* ─── Styled ─── */
const MainPage = styled.main`
  min-height: 100vh;
  padding-top: 4rem;
  padding-bottom: 0;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  @media (min-width: 1024px) { padding: 1.5rem 1.5rem; }
`;

const ChatLayout = styled.div`
  display: flex;
  height: calc(100vh - 7rem);
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid var(--border);
  background-color: var(--surface-base);
`;

/* Sidebar */
const Sidebar = styled.div`
  width: 18rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border);
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--border);
`;

const SidebarTitle = styled.h1`
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
`;

const ConnectionStatus = styled.span<{ $connected?: boolean }>`
  color: ${({ $connected }) => $connected ? "var(--success)" : "var(--muted-foreground)"};
  display: flex;
  align-items: center;
`;

const TabsRow = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
`;

const TabButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 0.625rem;
  font-size: 0.6875rem;
  font-weight: 600;
  transition: all 150ms;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ $active }) => $active ? "var(--primary)" : "var(--muted-foreground)"};
  border-bottom: ${({ $active }) => $active ? "2px solid var(--primary)" : "2px solid transparent"};
  &:hover { color: ${({ $active }) => $active ? "var(--primary)" : "var(--foreground)"}; }
`;

const TabBadge = styled.span`
  margin-left: 0.25rem;
  font-size: 0.625rem;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border-radius: 9999px;
  padding: 0.125rem 0.375rem;
`;

const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

/* Friends tab */
const EmptyFriends = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--muted-foreground);
  font-size: 0.8125rem;
  gap: 0.5rem;
`;

const FriendButton = styled.button<{ $selected?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  transition: background-color 150ms;
  text-align: left;
  border: none;
  cursor: pointer;
  background-color: ${({ $selected }) => $selected ? "color-mix(in oklch, var(--primary) 10%, transparent)" : "transparent"};
  &:hover { background-color: ${({ $selected }) => $selected ? "color-mix(in oklch, var(--primary) 10%, transparent)" : "var(--surface-raised)"}; }
`;

const FriendInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FriendName = styled.p`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
`;

const FriendHandle = styled.p`
  font-size: 0.6875rem;
  color: var(--muted-foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
`;

const UnreadBadge = styled.span`
  flex-shrink: 0;
  min-width: 1.125rem;
  height: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: var(--primary);
  color: var(--primary-foreground);
  font-size: 0.625rem;
  font-weight: 700;
  padding: 0 0.25rem;
`;

/* Requests tab */
const EmptyRequests = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 0.8125rem;
  color: var(--muted-foreground);
`;

const RequestItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  &:last-child { border-bottom: none; }
`;

const RequestActions = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
`;

const AcceptButton = styled.button`
  padding: 0.375rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  background-color: color-mix(in oklch, var(--primary) 10%, transparent);
  color: var(--primary);
  transition: all 150ms;
  &:hover { background-color: var(--primary); color: var(--primary-foreground); }
`;

const DeclineButton = styled.button`
  padding: 0.375rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  background-color: color-mix(in oklch, var(--destructive) 10%, transparent);
  color: var(--destructive);
  transition: all 150ms;
  &:hover { background-color: var(--destructive); color: var(--destructive-foreground); }
`;

/* Add friend tab */
const AddFriendPanel = styled.div`
  display: flex;
  flex-direction: column;
`;

const SearchPanel = styled.div`
  padding: 0.75rem;
  border-bottom: 1px solid var(--border);
`;

const SearchInputWrapper = styled.div`
  position: relative;
`;

const SearchIconWrapper = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  pointer-events: none;
  display: flex;
  align-items: center;
`;

const SearchInputField = styled.input`
  width: 100%;
  height: 2.25rem;
  padding-left: 2.25rem;
  padding-right: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  background-color: var(--surface-raised);
  border: 1px solid var(--border);
  outline: none;
  color: var(--foreground);
  &::placeholder { color: var(--text-tertiary); }
`;

const SearchCenter = styled.div`
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
`;

const SearchHint = styled.p`
  padding: 1.25rem;
  text-align: center;
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin: 0;
`;

const SearchResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border);
  &:last-child { border-bottom: none; }
`;

const UserStatusBadge = styled.span`
  flex-shrink: 0;
  font-size: 0.6875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  background-color: var(--surface-inset);
  color: var(--muted-foreground);
`;

const SentBadge = styled.span`
  flex-shrink: 0;
  font-size: 0.6875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  background-color: color-mix(in oklch, var(--primary) 10%, transparent);
  color: var(--primary);
`;

const AcceptSmallButton = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  background-color: color-mix(in oklch, var(--success) 10%, transparent);
  color: var(--success);
  transition: all 150ms;
  &:hover { background-color: var(--success); color: white; }
`;

const AddButton = styled.button`
  flex-shrink: 0;
  padding: 0.375rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  background-color: color-mix(in oklch, var(--primary) 10%, transparent);
  color: var(--primary);
  transition: all 150ms;
  &:hover { background-color: var(--primary); color: var(--primary-foreground); }
`;

/* Chat area */
const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
`;

const ChatHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ChatFriendName = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--foreground);
  line-height: 1.2;
  margin: 0;
`;

const ChatFriendHandle = styled.p`
  font-size: 0.75rem;
  color: var(--muted-foreground);
  margin: 0;
`;

const RemoveFriendButton = styled.button`
  font-size: 0.75rem;
  color: var(--destructive);
  background: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  &:hover { text-decoration: underline; }
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const UnreadDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: color-mix(in oklch, var(--primary) 30%, transparent);
`;

const DividerLabel = styled.span`
  font-size: 0.6875rem;
  color: var(--primary);
  font-weight: 500;
  flex-shrink: 0;
`;

const MessageRow = styled.div<{ $mine?: boolean }>`
  display: flex;
  justify-content: ${({ $mine }) => $mine ? "flex-end" : "flex-start"};
`;

const MessageBubble = styled.div<{ $mine?: boolean }>`
  max-width: 70%;
  padding: 0.625rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  line-height: 1.625;
  background-color: ${({ $mine }) => $mine ? "var(--primary)" : "var(--surface-raised)"};
  color: ${({ $mine }) => $mine ? "var(--primary-foreground)" : "var(--foreground)"};
  border-bottom-right-radius: ${({ $mine }) => $mine ? "0.25rem" : "1rem"};
  border-bottom-left-radius: ${({ $mine }) => $mine ? "1rem" : "0.25rem"};
`;

const MessageText = styled.p`
  overflow-wrap: break-word;
  margin: 0;
`;

const MessageMeta = styled.p<{ $mine?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.625rem;
  margin: 0.25rem 0 0;
  color: ${({ $mine }) => $mine ? "rgba(255,255,255,0.6)" : "var(--muted-foreground)"};
`;

const InputArea = styled.div`
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
`;

const InputRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const MessageInput = styled.input`
  flex: 1;
  height: 2.75rem;
  padding: 0 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  background-color: var(--surface-raised);
  border: 1px solid var(--border);
  outline: none;
  color: var(--foreground);
  &::placeholder { color: var(--text-tertiary); }
  &:disabled { opacity: 0.5; }
`;

const SendButton = styled.button`
  height: 2.75rem;
  width: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background-color: var(--primary);
  color: var(--primary-foreground);
  border: none;
  cursor: pointer;
  transition: opacity 150ms;
  flex-shrink: 0;
  &:hover:not(:disabled) { opacity: 0.8; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

const EmptyChat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  gap: 0.75rem;
`;

const EmptyChatTitle = styled.p`
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
`;

const EmptyChatSubtitle = styled.p`
  font-size: 0.875rem;
  color: var(--muted-foreground);
  margin: 0;
`;

export default function ChatPage() {
  const { user, unreadByFriend, markConversationRead, unreadFriendRequests, clearFriendRequests } = useStore();

  const [tab, setTab] = useState<"friends" | "requests" | "add">("friends");
  const [friends, setFriends] = useState<ApiFriend[]>([]);
  const [requests, setRequests] = useState<ApiFriend[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ApiFriend[]>([]);
  const [searching, setSearching] = useState(false);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    messagesApi.getConversation(friendId)
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
    if (val.trim().length < 2) { setSearchResults([]); return; }
    searchDebounce.current = setTimeout(async () => {
      setSearching(true);
      try { setSearchResults(await friendsApi.search(val.trim())); } catch {}
      setSearching(false);
    }, 350);
  }

  async function handleSendRequest(target: ApiFriend) {
    try {
      await friendsApi.add(target.id);
      setSearchResults((prev) => prev.map((r) => r.id === target.id ? { ...r, status: "pending_sent" } : r));
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
    } catch { toast.error("Erro ao aceitar solicitação."); }
  }

  async function handleDecline(requester: ApiFriend) {
    try {
      await friendsApi.remove(requester.id);
      setRequests((prev) => prev.filter((r) => r.id !== requester.id));
    } catch { toast.error("Erro ao recusar solicitação."); }
  }

  async function handleRemoveFriend(friendId: string) {
    try {
      await friendsApi.remove(friendId);
      setFriends((prev) => prev.filter((f) => f.id !== friendId));
      markConversationRead(friendId);
      if (selectedFriend?.id === friendId) setSelectedFriend(null);
      toast.success("Amigo removido.");
    } catch { toast.error("Erro ao remover amigo."); }
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
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao enviar mensagem.");
      setInput(content);
    } finally {
      setSending(false);
    }
  }

  return (
    <AuthGuard>
      <MainPage id="main-content">
        <Container>
          <ChatLayout>
            {/* Sidebar */}
            <Sidebar>
              <SidebarHeader>
                <SidebarTitle>Chat</SidebarTitle>
                <ConnectionStatus $connected={connected} title={connected ? "Conectado" : "Desconectado"}>
                  {connected ? <Wifi style={{ width: "1rem", height: "1rem" }} /> : <WifiOff style={{ width: "1rem", height: "1rem" }} />}
                </ConnectionStatus>
              </SidebarHeader>

              <TabsRow>
                {([
                  { key: "friends", label: "Amigos", badge: 0 },
                  { key: "requests", label: "Pedidos", badge: unreadFriendRequests },
                  { key: "add", label: "Adicionar", badge: 0 },
                ] as const).map((t) => (
                  <TabButton
                    key={t.key}
                    $active={tab === t.key}
                    onClick={() => { setTab(t.key); if (t.key === "requests") clearFriendRequests(); }}
                  >
                    {t.label}
                    {t.badge > 0 && <TabBadge>{t.badge}</TabBadge>}
                  </TabButton>
                ))}
              </TabsRow>

              <TabContent>
                {tab === "friends" && (
                  <>
                    {friends.length === 0 ? (
                      <EmptyFriends>
                        <Users style={{ width: "2rem", height: "2rem", opacity: 0.3 }} />
                        Nenhum amigo ainda.
                      </EmptyFriends>
                    ) : (
                      friends.map((f) => {
                        const friendUnread = unreadByFriend[f.id] ?? 0;
                        return (
                          <FriendButton key={f.id} onClick={() => handleSelectFriend(f)} $selected={selectedFriend?.id === f.id}>
                            <Avatar style={{ width: "2.25rem", height: "2.25rem", flexShrink: 0 }}>
                              <AvatarImage src={avatarUrl(f)} alt={f.displayName} />
                              <AvatarFallback>{f.displayName[0]}</AvatarFallback>
                            </Avatar>
                            <FriendInfo>
                              <FriendName>{f.displayName}</FriendName>
                              <FriendHandle>@{f.username}</FriendHandle>
                            </FriendInfo>
                            {friendUnread > 0 && (
                              <UnreadBadge>{friendUnread > 99 ? "99+" : friendUnread}</UnreadBadge>
                            )}
                          </FriendButton>
                        );
                      })
                    )}
                  </>
                )}

                {tab === "requests" && (
                  <>
                    {requests.length === 0 ? (
                      <EmptyRequests>Nenhum pedido pendente.</EmptyRequests>
                    ) : (
                      requests.map((req) => (
                        <RequestItem key={req.id}>
                          <Avatar style={{ width: "2.25rem", height: "2.25rem", flexShrink: 0 }}>
                            <AvatarImage src={avatarUrl(req)} alt={req.displayName} />
                            <AvatarFallback>{req.displayName[0]}</AvatarFallback>
                          </Avatar>
                          <FriendInfo style={{ flex: 1, minWidth: 0 }}>
                            <FriendName>{req.displayName}</FriendName>
                            <FriendHandle>@{req.username}</FriendHandle>
                          </FriendInfo>
                          <RequestActions>
                            <AcceptButton onClick={() => handleAccept(req)} aria-label="Aceitar">
                              <Check style={{ width: "0.875rem", height: "0.875rem" }} />
                            </AcceptButton>
                            <DeclineButton onClick={() => handleDecline(req)} aria-label="Recusar">
                              <X style={{ width: "0.875rem", height: "0.875rem" }} />
                            </DeclineButton>
                          </RequestActions>
                        </RequestItem>
                      ))
                    )}
                  </>
                )}

                {tab === "add" && (
                  <AddFriendPanel>
                    <SearchPanel>
                      <SearchInputWrapper>
                        <SearchIconWrapper>
                          <Search style={{ width: "0.875rem", height: "0.875rem" }} />
                        </SearchIconWrapper>
                        <SearchInputField
                          type="text"
                          placeholder="Buscar por nome ou e-mail..."
                          value={searchQuery}
                          onChange={(e) => handleSearchInput(e.target.value)}
                          autoFocus
                        />
                      </SearchInputWrapper>
                    </SearchPanel>

                    {searching && (
                      <SearchCenter>
                        <Loader2 style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite", color: "var(--muted-foreground)" }} />
                      </SearchCenter>
                    )}
                    {!searching && searchQuery.trim().length < 2 && (
                      <SearchHint>Digite ao menos 2 caracteres.</SearchHint>
                    )}
                    {!searching && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                      <SearchHint>Nenhum usuário encontrado.</SearchHint>
                    )}
                    {!searching && searchResults.map((r) => (
                      <SearchResultItem key={r.id}>
                        <Avatar style={{ width: "2.25rem", height: "2.25rem", flexShrink: 0 }}>
                          <AvatarImage src={avatarUrl(r)} alt={r.displayName} />
                          <AvatarFallback>{r.displayName[0]}</AvatarFallback>
                        </Avatar>
                        <FriendInfo style={{ flex: 1, minWidth: 0 }}>
                          <FriendName>{r.displayName}</FriendName>
                          <FriendHandle>@{r.username}</FriendHandle>
                        </FriendInfo>
                        {r.status === "accepted" && <UserStatusBadge>Amigo</UserStatusBadge>}
                        {r.status === "pending_sent" && <SentBadge>Enviado</SentBadge>}
                        {r.status === "pending_received" && (
                          <AcceptSmallButton onClick={() => handleAccept(r)}>
                            <Check style={{ width: "0.75rem", height: "0.75rem" }} /> Aceitar
                          </AcceptSmallButton>
                        )}
                        {r.status === "none" && (
                          <AddButton onClick={() => handleSendRequest(r)} aria-label={`Adicionar ${r.displayName}`}>
                            <UserPlus style={{ width: "0.875rem", height: "0.875rem" }} />
                          </AddButton>
                        )}
                      </SearchResultItem>
                    ))}
                  </AddFriendPanel>
                )}
              </TabContent>
            </Sidebar>

            {/* Chat area */}
            <ChatArea>
              {selectedFriend ? (
                <>
                  <ChatHeader>
                    <ChatHeaderInfo>
                      <Avatar style={{ width: "2.25rem", height: "2.25rem" }}>
                        <AvatarImage src={avatarUrl(selectedFriend)} alt={selectedFriend.displayName} />
                        <AvatarFallback>{selectedFriend.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <ChatFriendName>{selectedFriend.displayName}</ChatFriendName>
                        <ChatFriendHandle>@{selectedFriend.username}</ChatFriendHandle>
                      </div>
                    </ChatHeaderInfo>
                    <RemoveFriendButton onClick={() => handleRemoveFriend(selectedFriend.id)}>
                      Remover amigo
                    </RemoveFriendButton>
                  </ChatHeader>

                  <MessagesArea>
                    {loadingMsgs && messages.length === 0 ? (
                      <div style={{ display: "flex", justifyContent: "center", paddingTop: "2.5rem" }}>
                        <Loader2 style={{ width: "1.25rem", height: "1.25rem", animation: "spin 1s linear infinite", color: "var(--muted-foreground)" }} />
                      </div>
                    ) : messages.length === 0 ? (
                      <p style={{ textAlign: "center", padding: "3rem 0", fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
                        Nenhuma mensagem ainda. Diga olá! 👋
                      </p>
                    ) : (
                      <>
                        {messages.map((msg, idx) => {
                          const isMe = msg.senderId === user?.id;
                          return (
                            <Fragment key={msg.id}>
                              {firstUnreadIdx !== -1 && idx === firstUnreadIdx && (
                                <UnreadDivider>
                                  <DividerLine />
                                  <DividerLabel>
                                    {unreadCount === 1 ? "1 mensagem não lida" : `${unreadCount} mensagens não lidas`}
                                  </DividerLabel>
                                  <DividerLine />
                                </UnreadDivider>
                              )}
                              <MessageRow $mine={isMe}>
                                <MessageBubble $mine={isMe}>
                                  <MessageText>{msg.content}</MessageText>
                                  <MessageMeta $mine={isMe}>
                                    {formatTime(msg.sentAt)}
                                    {isMe && (msg.isRead ? <CheckCheck style={{ width: "0.75rem", height: "0.75rem" }} /> : <Check style={{ width: "0.75rem", height: "0.75rem" }} />)}
                                  </MessageMeta>
                                </MessageBubble>
                              </MessageRow>
                            </Fragment>
                          );
                        })}
                      </>
                    )}
                    <div ref={messagesEndRef} />
                  </MessagesArea>

                  <InputArea>
                    <InputRow>
                      <MessageInput
                        type="text"
                        placeholder={connected ? "Digite uma mensagem..." : "Conectando..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                        disabled={!connected}
                      />
                      <SendButton
                        onClick={handleSend}
                        disabled={!input.trim() || !connected || sending}
                        aria-label="Enviar"
                      >
                        {sending
                          ? <Loader2 style={{ width: "1rem", height: "1rem", animation: "spin 1s linear infinite" }} />
                          : <Send style={{ width: "1rem", height: "1rem" }} />}
                      </SendButton>
                    </InputRow>
                  </InputArea>
                </>
              ) : (
                <EmptyChat>
                  <MessageCircle style={{ width: "3rem", height: "3rem", color: "var(--muted-foreground)", opacity: 0.3 }} />
                  <EmptyChatTitle>Selecione um amigo</EmptyChatTitle>
                  <EmptyChatSubtitle>Escolha um amigo na lista para começar a conversa.</EmptyChatSubtitle>
                </EmptyChat>
              )}
            </ChatArea>
          </ChatLayout>
        </Container>
      </MainPage>
    </AuthGuard>
  );
}
