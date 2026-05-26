"use client";

import {
  createContext, useContext, useRef, useEffect, useCallback, useState,
  type ReactNode,
} from "react";
import * as signalR from "@microsoft/signalr";
import type { ApiMessage, ApiFriend } from "@/lib/types";

const HUB_URL = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/hubs/chat`;

type MsgHandler = (msg: ApiMessage) => void;
type FriendHandler = (friend: ApiFriend) => void;
type ReadHandler = (readByUserId: string) => void;

interface SignalRContextValue {
  connected: boolean;
  sendMessage: (receiverId: string, content: string) => Promise<void>;
  onMessage: (handler: MsgHandler) => () => void;
  onMessagesRead: (handler: ReadHandler) => () => void;
  onFriendRequestReceived: (handler: FriendHandler) => () => void;
  onFriendRequestAccepted: (handler: FriendHandler) => () => void;
}

const SignalRContext = createContext<SignalRContextValue | null>(null);

export function SignalRProvider({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const [connected, setConnected] = useState(false);
  const connRef = useRef<signalR.HubConnection | null>(null);
  const msgHandlers = useRef<Set<MsgHandler>>(new Set());
  const msgsReadHandlers = useRef<Set<ReadHandler>>(new Set());
  const reqReceivedHandlers = useRef<Set<FriendHandler>>(new Set());
  const reqAcceptedHandlers = useRef<Set<FriendHandler>>(new Set());

  useEffect(() => {
    if (!enabled) return;

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, { withCredentials: true })
      .withAutomaticReconnect([0, 1000, 3000, 5000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    conn.on("ReceiveMessage", (msg: ApiMessage) => {
      msgHandlers.current.forEach((h) => h(msg));
    });
    conn.on("MessagesRead", (readByUserId: string) => {
      msgsReadHandlers.current.forEach((h) => h(readByUserId));
    });
    conn.on("FriendRequestReceived", (friend: ApiFriend) => {
      reqReceivedHandlers.current.forEach((h) => h(friend));
    });
    conn.on("FriendRequestAccepted", (friend: ApiFriend) => {
      reqAcceptedHandlers.current.forEach((h) => h(friend));
    });

    conn.onreconnected(() => setConnected(true));
    conn.onclose(() => setConnected(false));
    conn.start().then(() => setConnected(true)).catch(() => setConnected(false));

    connRef.current = conn;
    return () => {
      conn.stop();
      connRef.current = null;
      setConnected(false);
    };
  }, [enabled]);

  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    const conn = connRef.current;
    if (!conn || conn.state !== signalR.HubConnectionState.Connected) {
      throw new Error("Sem conexão com o servidor.");
    }
    await conn.invoke("SendMessage", receiverId, content);
  }, []);

  const onMessage = useCallback((handler: MsgHandler) => {
    msgHandlers.current.add(handler);
    return () => { msgHandlers.current.delete(handler); };
  }, []);

  const onMessagesRead = useCallback((handler: ReadHandler) => {
    msgsReadHandlers.current.add(handler);
    return () => { msgsReadHandlers.current.delete(handler); };
  }, []);

  const onFriendRequestReceived = useCallback((handler: FriendHandler) => {
    reqReceivedHandlers.current.add(handler);
    return () => { reqReceivedHandlers.current.delete(handler); };
  }, []);

  const onFriendRequestAccepted = useCallback((handler: FriendHandler) => {
    reqAcceptedHandlers.current.add(handler);
    return () => { reqAcceptedHandlers.current.delete(handler); };
  }, []);

  return (
    <SignalRContext.Provider value={{ connected, sendMessage, onMessage, onMessagesRead, onFriendRequestReceived, onFriendRequestAccepted }}>
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalRContext() {
  const ctx = useContext(SignalRContext);
  if (!ctx) throw new Error("useSignalRContext must be used within SignalRProvider");
  return ctx;
}
