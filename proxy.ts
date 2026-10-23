import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_ADMIN, tokenValido } from "@/lib/sesion-admin";

// Protege el panel: sin cookie de administrador válida, redirige al ingreso.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/ingresar") return NextResponse.next();
  if (!(await tokenValido(req.cookies.get(COOKIE_ADMIN)?.value))) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/ingresar";
    url.search = "";
    url.searchParams.set("siguiente", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
