import { NextResponse } from "next/server";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { getSession } from "@/lib/auth";
import { q } from "@/lib/db";
import { UPLOAD_DIR } from "@/lib/admin/util";

export const runtime = "nodejs";
const MAX = 12 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const fd = await req.formData();
  const file = fd.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Envie um arquivo." }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "Arquivo maior que 12 MB." }, { status: 413 });

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const meta = await sharp(input).metadata();
    if (!meta.format || !["jpeg", "png", "webp", "avif", "gif", "heif"].includes(meta.format))
      return NextResponse.json({ error: "Formato não suportado. Use JPG, PNG ou WebP." }, { status: 415 });
    const { data, info } = await sharp(input).rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 }).toBuffer({ resolveWithObject: true });

    const d = new Date();
    const rel = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${crypto.randomUUID()}.webp`;
    const full = path.join(UPLOAD_DIR, rel);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, data);

    const alt = String(fd.get("alt") ?? "") || file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    const url = `/uploads/${rel}`;
    const r: any = await q("INSERT INTO media (url, alt_text, width, height, size_bytes) VALUES (?,?,?,?,?)", [url, alt.slice(0, 255), info.width, info.height, info.size]);
    return NextResponse.json({ id: (r as any).insertId ?? null, url, alt_text: alt });
  } catch (e) {
    console.error("[upload]", e);
    return NextResponse.json({ error: "Não foi possível processar a imagem." }, { status: 400 });
  }
}
