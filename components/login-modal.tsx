"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogIn, Loader2 } from "lucide-react";

export function LoginModal() {
  const { loginModalOpen, setLoginModalOpen, login, authLoading } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credenciais inválidas");
    }
  };

  return (
    <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
      <DialogContent className="glass sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Entrar na Nebula</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="modal-email">E-mail</Label>
            <Input
              id="modal-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modal-password">Senha</Label>
            <Input
              id="modal-password"
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full gap-2" disabled={authLoading}>
            {authLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            Entrar
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Conta de teste: admin@nebula.com / Admin@123
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
