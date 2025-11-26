import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token");
  const { pathname } = request.nextUrl;

  // Rutas públicas (no requieren autenticación)
  const publicPaths = ["/login", "/ver", "/api/auth", "/api/presupuestos/enviar"];
  const isPublicPath =
    publicPaths.some((path) => pathname.startsWith(path)) ||
    pathname.match(/^\/api\/presupuestos\/[^/]+\/pdf$/); // Para PDFs públicos

  // Si no está autenticado y trata de acceder a rutas protegidas
  if (!authToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si está autenticado y trata de acceder al login, redirigir al home
  if (authToken && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

