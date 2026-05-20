"use client";

import { useStore } from "@/lib/store";

interface AuthGuardProps {
  children: React.ReactNode;
}

// O middleware já protege as rotas privadas via cookie.
// Este componente só evita o flash de conteúdo durante a hidratação do Zustand.
export function AuthGuard({ children }: AuthGuardProps) {
  const isLoggedIn = useStore((s) => s.isLoggedIn);
  if (!isLoggedIn) return null;
  return <>{children}</>;
}
