import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", weight: ["600", "700"], display: "swap" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", weight: ["400", "500", "600"], display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", weight: ["500"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Agrotechnica | Peças e manutenção de drones agrícolas em Cristalina-GO", template: "%s | Agrotechnica" },
  description: "Peças originais XAG e DJI, manutenção de drones, baterias e geradores, piloto automático Topcon e sinal RTK. Cristalina, Goiás.",
  icons: { icon: "/brand/logo.jpg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bricolage.variable} ${figtree.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
