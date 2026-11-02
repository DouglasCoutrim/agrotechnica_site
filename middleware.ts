import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const open = ["/admin/login", "/admin/setup"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (open.includes(pathname)) return NextResponse.next();
  const token = req.cookies.get("agt_session")?.value;
  try {
    if (!token) throw new Error("sem sessão");
    await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET ?? ""));
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
