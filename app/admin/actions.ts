"use server";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";
import { q } from "@/lib/db";
import { createSession, destroySession, requireUser, getSession } from "@/lib/auth";
import { byKey, type Field } from "@/lib/admin/resources";
import { slugify, removeFile, nowSql } from "@/lib/admin/util";
import { defaultSections } from "@/lib/defaults";

const MAX_FAILS = 5;
const LOCK_MIN = 15;

/* ---------- Login / logout / primeiro acesso ---------- */
export async function login(_: { error?: string } | undefined, fd: FormData) {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  const [u] = await q<any>("SELECT * FROM users WHERE email=?", [email]);
  if (!u) { await bcrypt.compare(password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv"); return { error: "E-mail ou senha incorretos." }; }
  if (u.locked_until && new Date(u.locked_until.replace(" ", "T") + "Z") > new Date())
    return { error: `Acesso bloqueado por tentativas excessivas. Tente de novo em ${LOCK_MIN} minutos.` };
  if (!(await bcrypt.compare(password, u.password_hash))) {
    const fails = u.failed_logins + 1;
    await q("UPDATE users SET failed_logins=?, locked_until=? WHERE id=?",
      [fails >= MAX_FAILS ? 0 : fails, fails >= MAX_FAILS ? new Date(Date.now() + LOCK_MIN * 60_000).toISOString().slice(0, 19).replace("T", " ") : null, u.id]);
    return { error: "E-mail ou senha incorretos." };
  }
  await q("UPDATE users SET failed_logins=0, locked_until=NULL WHERE id=?", [u.id]);
  await createSession({ uid: u.id, role: u.role, name: u.full_name || u.email });
  redirect("/admin");
}

export async function logout() { await destroySession(); redirect("/admin/login"); }

export async function setupAdmin(_: { error?: string } | undefined, fd: FormData) {
  const [{ n }] = await q<{ n: number }>("SELECT COUNT(*) n FROM users");
  if (n > 0) redirect("/admin/login");
  const token = process.env.SETUP_TOKEN ?? "";
  if (token.length < 12) return { error: "Defina SETUP_TOKEN (12+ caracteres) nas variáveis de ambiente e reinicie o app." };
  if (String(fd.get("token")) !== token) return { error: "Chave de instalação incorreta." };
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "E-mail inválido." };
  if (password.length < 10) return { error: "A senha precisa ter pelo menos 10 caracteres." };
  await q("INSERT INTO users (email, full_name, password_hash, role) VALUES (?,?,?, 'admin')",
    [email, String(fd.get("name") ?? "").trim() || null, await bcrypt.hash(password, 12)]);
  redirect("/admin/login");
}

/* ---------- CRUD genérico ---------- */
function parse(f: Field, fd: FormData): unknown {
  const raw = fd.get(f.name);
  const s = typeof raw === "string" ? raw.trim() : "";
  switch (f.type) {
    case "bool": return fd.has(f.name) ? 1 : 0;
    case "number": return s === "" ? (f.name === "position" ? 0 : null) : Number(s);
    case "media": case "ref": return s === "" ? null : Number(s);
    case "list": { const a = s.split("\n").map((x) => x.trim()).filter(Boolean); return a.length ? JSON.stringify(a) : null; }
    case "hours": {
      const a = s.split("\n").map((l) => l.split("|").map((x) => x.trim())).filter((p) => p[0]).map((p) => ({ dia: p[0], horario: p[1] ?? "" }));
      return a.length ? JSON.stringify(a) : null;
    }
    case "json": if (!s) return null; JSON.parse(s); return s;
    case "datetime": return s ? s.replace("T", " ") + ":00" : null;
    default: return s === "" ? null : f.max ? s.slice(0, f.max) : s;
  }
}

export async function saveRecord(key: string, id: string, fd: FormData) {
  const session = await requireUser();
  const res = byKey(key);
  if (!res || (res.adminOnly && session.role !== "admin")) redirect("/admin");
  const back = res.singleton ? `/admin/${key}` : `/admin/${key}/${id}`;
  const fail = (m: string) => redirect(`${back}?erro=${encodeURIComponent(m)}`);

  const cols: Record<string, unknown> = {};
  for (const f of res.fields) {
    if (f.type === "readonly") continue;
    if (f.type === "password") {
      const pw = String(fd.get(f.name) ?? "");
      if (pw) { if (pw.length < 10) fail("A senha precisa ter pelo menos 10 caracteres."); cols[f.name] = await bcrypt.hash(pw, 12); }
      else if (id === "novo") fail("Defina uma senha.");
      continue;
    }
    try { cols[f.name] = parse(f, fd); } catch { fail(`O campo “${f.label}” tem um formato inválido.`); }
    if (f.required && (cols[f.name] == null || cols[f.name] === "")) fail(`Preencha o campo “${f.label}”.`);
  }
  if (res.slugFrom) cols.slug = slugify(String(cols.slug || cols[res.slugFrom] || ""));
  if (res.key === "blog" && cols.is_published && !cols.published_at) cols.published_at = nowSql();
  if (res.key === "usuarios") {
    cols.email = String(cols.email).toLowerCase();
    if (id !== "novo" && Number(id) === session.uid && cols.role !== "admin") fail("Você não pode remover seu próprio acesso de administrador.");
  }

  const names = Object.keys(cols);
  try {
    if (res.singleton) {
      await q(`INSERT INTO ${res.table} (id, ${names.join(",")}) VALUES (1, ${names.map(() => "?").join(",")})
        ON DUPLICATE KEY UPDATE ${names.map((n) => `${n}=VALUES(${n})`).join(",")}`, Object.values(cols));
    } else if (id === "novo") {
      await q(`INSERT INTO ${res.table} (${names.join(",")}) VALUES (${names.map(() => "?").join(",")})`, Object.values(cols));
    } else {
      await q(`UPDATE ${res.table} SET ${names.map((n) => `${n}=?`).join(",")} WHERE id=?`, [...Object.values(cols), Number(id)]);
    }
  } catch (e: any) {
    if (e?.code === "ER_DUP_ENTRY") fail("Já existe um registro com esse endereço/nome. Altere e tente de novo.");
    console.error("[admin:save]", e);
    fail("Não foi possível salvar. Tente novamente.");
  }
  res.tags.forEach((t) => revalidateTag(t));
  revalidatePath("/", "layout");
  redirect(res.singleton ? `/admin/${key}?ok=1` : `/admin/${key}?ok=1`);
}

export async function deleteRecord(key: string, id: number) {
  const session = await requireUser();
  const res = byKey(key);
  if (!res || res.singleton || (res.adminOnly && session.role !== "admin")) redirect("/admin");
  if (key === "usuarios" && id === session.uid) redirect(`/admin/${key}?erro=${encodeURIComponent("Você não pode excluir o próprio usuário.")}`);
  await q(`DELETE FROM ${res.table} WHERE id=?`, [id]);
  res.tags.forEach((t) => revalidateTag(t));
  revalidatePath("/", "layout");
  redirect(`/admin/${key}?ok=1`);
}

/** Cria os textos que o site usa por padrão, para o cliente editar. */
export async function seedSections() {
  await requireUser();
  for (const [k, s] of Object.entries(defaultSections)) {
    const [page, section_key] = k.split(".");
    await q(`INSERT IGNORE INTO page_sections (page, section_key, eyebrow, title, subtitle, body, cta_label, cta_url, extra)
      VALUES (?,?,?,?,?,?,?,?,?)`, [page, section_key, s.eyebrow ?? null, s.title ?? null, s.subtitle ?? null, s.body ?? null,
      s.cta_label ?? null, s.cta_url ?? null, s.extra ? JSON.stringify(s.extra) : null]);
  }
  revalidateTag("sections");
  revalidatePath("/", "layout");
  redirect("/admin/secoes?ok=1");
}

export async function deleteMedia(id: number) {
  await requireUser();
  const [m] = await q<{ url: string }>("SELECT url FROM media WHERE id=?", [id]);
  if (m) { await q("DELETE FROM media WHERE id=?", [id]); await removeFile(m.url); }
  ["services", "products", "sections", "posts", "team", "portfolio", "promotions"].forEach((t) => revalidateTag(t));
  revalidatePath("/", "layout");
  redirect("/admin/midia?ok=1");
}

export async function whoami() { return getSession(); }
