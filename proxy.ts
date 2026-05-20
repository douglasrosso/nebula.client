import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIVATE_ROUTES = ["/biblioteca", "/lista-desejos", "/perfil", "/carrinho"];
const GUEST_ROUTES = ["/login", "/cadastro"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("NebulaAuthToken")?.value;
  const isAuthenticated = Boolean(token);

  if (GUEST_ROUTES.some((r) => pathname.startsWith(r))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (PRIVATE_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isAuthenticated) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
