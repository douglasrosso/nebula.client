"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";

const AUTH_ROUTES = ["/login", "/cadastro"];

export function ConditionalHeader() {
  const pathname = usePathname();
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) return null;
  return <Header />;
}
