"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, authLoading } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const redirect = searchParams.get("redirect") ?? "/";

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.replace(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credenciais inválidas");
    }
  };

  return (
    <div className="w-full max-w-[340px] animate-fade-in">
      <div className="flex flex-col items-center mb-10">
        <div
          className="w-20 h-20 rounded-[22px] flex items-center justify-center mb-6 shadow-lg"
          style={{ background: "linear-gradient(145deg, oklch(0.55 0.26 258), oklch(0.45 0.24 280))" }}
        >
          <span className="text-white font-black text-3xl tracking-tight select-none">N</span>
        </div>
        <h1 className="text-[28px] font-bold tracking-tight text-foreground">Nebula</h1>
        <p className="text-[15px] mt-1 text-muted-foreground">Entre na sua conta para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="rounded-[14px] overflow-hidden bg-surface-raised border border-border">
          <div className="px-4 py-3.5">
            <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
              E-mail
            </label>
            <input
              id="email" type="email" placeholder="seu@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent text-[17px] text-foreground placeholder:text-text-tertiary outline-none"
            />
          </div>
          <div className="h-px bg-border" />
          <div className="px-4 py-3.5">
            <label htmlFor="password" className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground">
              Senha
            </label>
            <input
              id="password" type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent text-[17px] text-foreground placeholder:text-text-tertiary outline-none"
            />
          </div>
        </div>

        {error && (
          <p className="text-[13px] px-4 py-2.5 rounded-[10px] text-destructive bg-destructive/10">
            {error}
          </p>
        )}

        <button
          type="submit" disabled={authLoading}
          className="w-full h-[50px] rounded-[14px] text-[17px] font-semibold text-primary-foreground bg-primary transition-opacity duration-150 disabled:opacity-60 flex items-center justify-center"
        >
          {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Entrar"}
        </button>
      </form>

      <div className="mt-6 space-y-3 text-center">
        <p className="text-[15px] text-muted-foreground">
          Não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold text-primary hover:opacity-70 transition-opacity">
            Criar conta
          </Link>
        </p>
        <p className="text-[13px] pt-3 border-t border-border text-text-tertiary">
          Conta de teste:{" "}
          <span className="font-mono text-[12px]">admin@nebula.com</span>
          {" / "}
          <span className="font-mono text-[12px]">Admin@123</span>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-background">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
