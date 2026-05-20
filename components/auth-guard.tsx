"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Lock, LogIn } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AuthGuard({
  children,
  title = "Acesso restrito",
  description = "Faça login para acessar esta página.",
}: AuthGuardProps) {
  const { isLoggedIn, setLoginModalOpen } = useStore();

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen pt-20 lg:pt-24 pb-12 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-3">{title}</h1>
          <p className="text-muted-foreground mb-8">{description}</p>
          <Button size="lg" className="gap-2" onClick={() => setLoginModalOpen(true)}>
            <LogIn className="w-4 h-4" />
            Fazer login
          </Button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
