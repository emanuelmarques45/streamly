import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("auth")?.value;

  if (!token) return redirectToLogin(req);

  try {
    verifyToken(token);
    return NextResponse.next();
  } catch {
    const response = redirectToLogin(req);
    // Token expirado/inválido: limpa o cookie para não repetir o ciclo.
    response.cookies.delete("auth");
    return response;
  }
}

function redirectToLogin(req: NextRequest) {
  const loginUrl = req.nextUrl.clone();

  loginUrl.pathname = "/login";
  loginUrl.search = "";
  loginUrl.searchParams.set("redirect", req.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = { matcher: ["/profile"] };
