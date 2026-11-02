import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getServices, getProducts, getPosts } from "@/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [sv, pr, po] = await Promise.all([getServices(), getProducts(), getPosts()]);
  const fixed = ["", "/servicos", "/pecas", "/gps-piloto-automatico", "/promocoes", "/portfolio", "/sobre", "/blog", "/contato"];
  return [
    ...fixed.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...sv.map((s) => ({ url: `${SITE_URL}/servicos/${s.slug}`, priority: 0.8 })),
    ...pr.map((p) => ({ url: `${SITE_URL}/pecas/${p.slug}`, priority: 0.6 })),
    ...po.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, priority: 0.5 })),
  ];
}
