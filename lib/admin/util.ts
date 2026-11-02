import fs from "node:fs/promises";
import path from "node:path";

export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");

export function slugify(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 120) || "item";
}

/** Converte "/uploads/2026/11/x.webp" em caminho seguro dentro de UPLOAD_DIR. */
export function uploadPath(url: string) {
  const rel = url.replace(/^\/uploads\//, "");
  const full = path.resolve(UPLOAD_DIR, rel);
  if (!full.startsWith(path.resolve(UPLOAD_DIR) + path.sep)) throw new Error("caminho inválido");
  return full;
}

export async function removeFile(url: string) {
  try { await fs.unlink(uploadPath(url)); } catch { /* arquivo já removido */ }
}

export const nowSql = () => new Date().toISOString().slice(0, 19).replace("T", " ");
