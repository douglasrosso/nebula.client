import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ptBRCurrency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const ptBRTime = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

export function formatPrice(price: number): string {
  if (price === 0) return "Gratuito";
  return ptBRCurrency.format(price);
}

export function formatTime(iso: string): string {
  return ptBRTime.format(new Date(iso));
}

export function avatarUrl(user: { avatar?: string | null; username: string }): string {
  return user.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;
}
