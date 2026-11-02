import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "agt_session";
export type Session = { uid: number; role: "admin" | "editor"; name: string };

const key = () => new TextEncoder().encode(process.env.AUTH_SECRET ?? "");

export async function createSession(s: Session) {
  if ((process.env.AUTH_SECRET ?? "").length < 32) throw new Error("AUTH_SECRET precisa ter 32 caracteres ou mais.");
  const jwt = await new SignJWT({ ...s }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key());
  (await cookies()).set(SESSION_COOKIE, jwt, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7,
  });
}

export async function verifyToken(token?: string): Promise<Session | null> {
  if (!token) return null;
  try { return (await jwtVerify(token, key())).payload as unknown as Session; } catch { return null; }
}

export async function getSession() { return verifyToken((await cookies()).get(SESSION_COOKIE)?.value); }

export async function requireUser(adminOnly = false) {
  const s = await getSession();
  if (!s) redirect("/admin/login");
  if (adminOnly && s.role !== "admin") redirect("/admin");
  return s;
}

export async function destroySession() { (await cookies()).delete(SESSION_COOKIE); }
