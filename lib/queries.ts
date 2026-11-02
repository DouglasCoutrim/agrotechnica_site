import { unstable_cache } from "next/cache";
import { q, json } from "./db";
import * as D from "./defaults";
import type { Settings, Section, Service, Product, Testimonial, Faq, Promotion, Post, TeamMember, PortfolioItem } from "./types";

/** Lê do MariaDB com cache por tag (invalidada no admin). Se o banco falhar ou estiver vazio, usa o conteúdo padrão. */
function cached<T>(tag: string, keyParts: string[], fn: () => Promise<T>, fallback: T): Promise<T> {
  return unstable_cache(
    async () => { try { return await fn(); } catch (e) { console.error(`[db:${tag}]`, e); return fallback; } },
    [tag, ...keyParts], { tags: [tag], revalidate: 300 }
  )();
}
const orDefault = <T,>(rows: T[], d: T[]) => (rows.length ? rows : d);
const ph = (slug: string) => (slug.includes("bateria") ? "bateria" : slug.includes("gps") || slug.includes("rtk") ? "gps" : "drone");

export const getSettings = () => cached<Settings>("settings", [], async () => {
  const [r] = await q("SELECT * FROM site_settings WHERE id=1");
  if (!r) return D.defaultSettings;
  return { ...D.defaultSettings, ...Object.fromEntries(Object.entries(r).filter(([, v]) => v != null)),
    opening_hours: json(r.opening_hours, D.defaultSettings.opening_hours) } as Settings;
}, D.defaultSettings);

export const getWhatsAppMessages = () => cached<Record<string, string>>("wa", [], async () => {
  const rows = await q<{ route_pattern: string; message: string }>("SELECT route_pattern, message FROM whatsapp_messages");
  return rows.length ? Object.fromEntries(rows.map((r) => [r.route_pattern, r.message])) : D.defaultWhatsApp;
}, D.defaultWhatsApp);

export const getSection = (page: string, key: string) => cached<Section>("sections", [page, key], async () => {
  const [r] = await q(
    `SELECT s.*, m.url AS image_url FROM page_sections s LEFT JOIN media m ON m.id=s.image_id
     WHERE s.page=? AND s.section_key=? AND s.is_published=1`, [page, key]);
  const d = D.defaultSections[`${page}.${key}`] ?? {};
  return r ? { ...d, ...Object.fromEntries(Object.entries(r).filter(([, v]) => v != null)), extra: json(r.extra, d.extra) } : d;
}, D.defaultSections[`${page}.${key}`] ?? {});

export const getServices = () => cached<Service[]>("services", [], async () => {
  const rows = await q(`SELECT s.*, m.url AS image_url FROM services s LEFT JOIN media m ON m.id=s.image_id
    WHERE s.is_published=1 ORDER BY s.position, s.id`);
  return orDefault(rows.map((r) => ({ ...r, features: json(r.features, []), placeholder: ph(r.slug) })) as unknown as Service[], D.defaultServices);
}, D.defaultServices);

export const getProducts = () => cached<Product[]>("products", [], async () => {
  const rows = await q(`SELECT p.*, m.url AS image_url, c.name AS category, b.name AS brand FROM products p
    LEFT JOIN media m ON m.id=p.image_id LEFT JOIN product_categories c ON c.id=p.category_id
    LEFT JOIN brands b ON b.id=p.brand_id WHERE p.is_published=1 ORDER BY p.is_featured DESC, p.id DESC`);
  return orDefault(rows.map((r) => ({ ...r, in_stock: !!r.in_stock, placeholder: ph(r.slug) })) as Product[], D.defaultProducts);
}, D.defaultProducts);

export const getTestimonials = () => cached<Testimonial[]>("testimonials", [], async () =>
  orDefault(await q<Testimonial>("SELECT author, role, content FROM testimonials WHERE is_published=1 ORDER BY position, id"), D.defaultTestimonials),
  D.defaultTestimonials);

export const getFaqs = (page = "geral") => cached<Faq[]>("faqs", [page], async () =>
  orDefault(await q<Faq>("SELECT question, answer FROM faqs WHERE is_published=1 AND page IN (?, 'geral') ORDER BY position, id", [page]), D.defaultFaqs),
  D.defaultFaqs);

export const getPromotions = () => cached<Promotion[]>("promotions", [], async () =>
  await q<Promotion>(`SELECT p.title, p.description, p.ends_at, p.cta_label, m.url AS image_url, pr.name AS product_name
    FROM promotions p LEFT JOIN media m ON m.id=p.image_id LEFT JOIN products pr ON pr.id=p.product_id
    WHERE p.is_published=1 AND (p.starts_at IS NULL OR p.starts_at<=CURDATE()) AND (p.ends_at IS NULL OR p.ends_at>=CURDATE())
    ORDER BY p.ends_at IS NULL, p.ends_at`), []);

export const getPosts = () => cached<Post[]>("posts", [], async () =>
  await q<Post>(`SELECT p.slug, p.title, p.excerpt, p.category, p.published_at, m.url AS image_url
    FROM posts p LEFT JOIN media m ON m.id=p.cover_id WHERE p.is_published=1 AND p.published_at<=NOW() ORDER BY p.published_at DESC`), []);

export const getPost = (slug: string) => cached<Post | null>("posts", ["one", slug], async () => {
  const [r] = await q<Post>(`SELECT p.*, m.url AS image_url FROM posts p LEFT JOIN media m ON m.id=p.cover_id
    WHERE p.slug=? AND p.is_published=1`, [slug]);
  return r ?? null;
}, null);

export const getTeam = () => cached<TeamMember[]>("team", [], async () => {
  const rows = await q(`SELECT t.*, m.url AS photo_url FROM team_members t LEFT JOIN media m ON m.id=t.photo_id
    WHERE t.is_published=1 ORDER BY t.position, t.id`);
  return orDefault(rows.map((r) => ({ ...r, certifications: json(r.certifications, []) })) as unknown as TeamMember[], D.defaultTeam);
}, D.defaultTeam);

export const getPortfolio = () => cached<PortfolioItem[]>("portfolio", [], async () =>
  orDefault(await q<PortfolioItem>(`SELECT i.slug, i.title, i.description, i.category, m.url AS image_url
    FROM portfolio_items i LEFT JOIN media m ON m.id=i.cover_id WHERE i.is_published=1 ORDER BY i.position, i.id`), D.defaultPortfolio),
  D.defaultPortfolio);
