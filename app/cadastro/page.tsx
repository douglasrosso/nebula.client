"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usersApi } from "@/lib/api";
import { useStore } from "@/lib/store";
import { Loader2 } from "lucide-react";

export default function CadastroPage() {
  const router = useRouter();
  const { login } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "", confirmPassword: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("As senhas não coincidem."); return; }
    setLoading(true);
    try {
      await usersApi.create({ name: form.name, email: form.email, username: form.username || undefined, password: form.password });
      await login(form.email, form.password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-transparent text-[17px] text-foreground placeholder:text-text-tertiary outline-none";
  const labelClass = "block text-[11px] font-semibold uppercase tracking-wider mb-1.5 text-muted-foreground";

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-[340px] animate-fade-in">
        <div className="flex flex-col items-center mb-10">
          <div
            className="w-20 h-20 rounded-[22px] flex items-center justify-center mb-6 shadow-lg"
            style={{ background: "linear-gradient(145deg, oklch(0.55 0.26 258), oklch(0.45 0.24 280))" }}
          >
            <span className="text-white font-black text-3xl tracking-tight select-none">N</span>
          </div>
          <h1 className="text-[28px] font-bold tracking-tight text-foreground">Criar conta</h1>
          <p className="text-[15px] mt-1 text-muted-foreground">Junte-se à Nebula</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name + Username */}
          <div className="rounded-[14px] overflow-hidden bg-surface-raised border border-border">
            <div className="px-4 py-3.5">
              <label htmlFor="name" className={labelClass}>Nome completo</label>
              <input id="name" name="name" type="text" placeholder="Seu nome" value={form.name} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="h-px bg-border" />
            <div className="px-4 py-3.5">
              <label htmlFor="username" className={labelClass}>
                Usuário <span className="normal-case font-normal text-text-tertiary">(opcional)</span>
              </label>
              <input id="username" name="username" type="text" placeholder="@usuario" value={form.username} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {/* Email */}
          <div className="rounded-[14px] overflow-hidden bg-surface-raised border border-border">
            <div className="px-4 py-3.5">
              <label htmlFor="email" className={labelClass}>E-mail</label>
              <input id="email" name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} required className={inputClass} />
            </div>
          </div>

          {/* Passwords */}
          <div className="rounded-[14px] overflow-hidden bg-surface-raised border border-border">
            <div className="px-4 py-3.5">
              <label htmlFor="password" className={labelClass}>Senha</label>
              <input id="password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required className={inputClass} />
            </div>
            <div className="h-px bg-border" />
            <div className="px-4 py-3.5">
              <label htmlFor="confirmPassword" className={labelClass}>Confirmar senha</label>
              <input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} required className={inputClass} />
            </div>
          </div>

          {error && (
            <p className="text-[13px] px-4 py-2.5 rounded-[10px] text-destructive bg-destructive/10">{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full h-[50px] rounded-[14px] text-[17px] font-semibold text-primary-foreground bg-primary transition-opacity duration-150 disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-[15px] text-center text-muted-foreground">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-semibold text-primary hover:opacity-70 transition-opacity">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
