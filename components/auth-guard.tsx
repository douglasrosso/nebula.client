"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  const isHydrated = useStore((s) => s.isHydrated);
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isHydrated, isLoggedIn, router]);

  if (!isHydrated || !isLoggedIn) return null;
  return <>{children}</>;
}
