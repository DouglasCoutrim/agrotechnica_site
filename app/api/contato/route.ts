import { NextResponse } from "next/server";
import { z } from "zod";
import { q } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(30),
  email: z.string().trim().email().max(150).optional().or(z.literal("")),
  interest: z.string().trim().max(60).optional(),
  message: z.string().trim().max(2000).optional(),
  website: z.string().optional(), // honeypot: robôs preenchem
});

const hits = new Map<string, number[]>(); // limite simples por IP (memória do processo)

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 5) return NextResponse.json({ error: "rate" }, { status: 429 });
  hits.set(ip, [...recent, now]);

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true }); // finge sucesso para o robô

  try {
    await q("INSERT INTO leads (name, phone, email, interest, message) VALUES (?,?,?,?,?)",
      [d.name, d.phone, d.email || null, d.interest || null, d.message || null]);
  } catch (e) {
    console.error("[leads]", e);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
