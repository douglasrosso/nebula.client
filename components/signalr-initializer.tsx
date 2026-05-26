"use client";

import { useEffect, useCallback, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import { SignalRProvider, useSignalRContext } from "@/contexts/signalr-context";
import type { ApiMessage, ApiFriend } from "@/lib/types";

function NotificationTracker() {
  const { onMessage, onFriendRequestReceived } = useSignalRContext();
  const { incrementUnreadForFriend, incrementFriendRequests } = useStore();
  const userId = useStore((s) => s.user?.id);

  const handleMessage = useCallback((msg: ApiMessage) => {
    if (msg.senderId === userId) return;
    incrementUnreadForFriend(msg.senderId);
  }, [incrementUnreadForFriend, userId]);

  const handleFriendRequest = useCallback((_friend: ApiFriend) => {
    incrementFriendRequests();
  }, [incrementFriendRequests]);

  useEffect(() => onMessage(handleMessage), [onMessage, handleMessage]);
  useEffect(() => onFriendRequestReceived(handleFriendRequest), [onFriendRequestReceived, handleFriendRequest]);

  return null;
}

export function SignalRInitializer({ children }: { children: ReactNode }) {
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const isHydrated = useStore((s) => s.isHydrated);

  return (
    <SignalRProvider enabled={isHydrated && isLoggedIn}>
      <NotificationTracker />
      {children}
    </SignalRProvider>
  );
}
