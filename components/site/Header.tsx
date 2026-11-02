"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/servicos", label: "Serviços" },
  { href: "/pecas", label: "Peças" },
  { href: "/gps-piloto-automatico", label: "GPS e piloto automático" },
  { href: "/promocoes", label: "Promoções" },
  { href: "/blog", label: "Blog" },
  { href: "/sobre", label: "Sobre" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  return (
    <header className={`sticky top-0 z-40 transition-all ${scrolled ? "bg-paper/90 backdrop-blur border-b hairline" : "bg-paper"}`}>
      <div className="container-site flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Agrotechnica, página inicial">
          <Image src="/brand/logo.jpg" alt="" width={56} height={56} className="mix-blend-multiply" priority />
          <span className="font-display text-xl font-bold tracking-tight text-forest-900">Agrotechnica</span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              aria-current={path.startsWith(l.href) ? "page" : undefined}
              className={`text-[0.95rem] font-medium transition-colors hover:text-forest-700 ${path.startsWith(l.href) ? "text-forest-900 underline decoration-gold-500 decoration-2 underline-offset-8" : "text-ink"}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/contato" className="hidden rounded-md bg-forest-900 px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-forest-700 sm:inline-block">
            Solicitar orçamento
          </Link>
          <button onClick={() => setOpen(true)} className="rounded-md border hairline p-2.5 lg:hidden" aria-label="Abrir menu" aria-expanded={open}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-forest-950 text-paper" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex h-20 items-center justify-between px-5">
            <span className="font-display text-xl font-bold">Agrotechnica</span>
            <button onClick={() => setOpen(false)} aria-label="Fechar menu" className="rounded-md border border-white/20 p-2.5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 pb-10 pt-4">
            {[...links, { href: "/contato", label: "Contato" }].map((l) => (
              <Link key={l.href} href={l.href} className="border-b border-white/10 py-4 font-display text-2xl font-semibold">{l.label}</Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
