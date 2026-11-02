import type { Metadata } from "next";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.agrotechnica.site";
export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: "Agrotechnica", locale: "pt_BR", type: "website", images: ["/brand/logo.jpg"] },
  };
}
