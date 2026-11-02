import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { LinkButton } from "@/components/ui/Button";
import { waLink } from "@/lib/whatsapp";
import type { Service, Product, Promotion, Faq, Post } from "@/lib/types";

export const fmtDate = (d?: string | null) => (d ? new Date(d.replace(" ", "T")).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : "");
export const fmtLong = (d?: string | null) => (d ? new Date(d.replace(" ", "T")).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" }) : "");

export function ServiceCard({ s }: { s: Service }) {
  return (
    <Link href={`/servicos/${s.slug}`} className="group flex flex-col border hairline bg-white/40 transition-colors hover:border-gold-500">
      <Photo src={s.image_url} placeholder={s.placeholder} alt={s.title} className="aspect-[3/2]" sizes="(min-width:1024px) 25vw, 50vw" />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="!text-xl">{s.title}</h3>
        <p className="mt-3 flex-1 text-[0.95rem] text-ink-muted">{s.short_description}</p>
        <span className="mt-5 text-sm font-semibold text-forest-700">Ver detalhes <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span></span>
      </div>
    </Link>
  );
}

export function ProductCard({ p, number }: { p: Product; number: string }) {
  const msg = `Olá! Vi o produto ${p.name} no site da Agrotechnica e quero um orçamento.`;
  return (
    <article className="flex flex-col border hairline bg-white/40">
      <Link href={`/pecas/${p.slug}`} className="relative block">
        <Photo src={p.image_url} placeholder={p.placeholder} alt={p.name} className="aspect-square" sizes="(min-width:1024px) 25vw, 50vw" />
        {p.in_stock && <span className="absolute left-3 top-3 rounded-sm bg-gold-300 px-2.5 py-1 font-mono text-xs font-medium text-forest-950">Pronta entrega</span>}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-xs text-forest-700">{[p.brand, p.category].filter(Boolean).join(" · ")}</p>
        <h3 className="mt-1 !text-lg"><Link href={`/pecas/${p.slug}`}>{p.name}</Link></h3>
        <div className="mt-auto pt-5"><LinkButton href={waLink(number, msg)} external variant="primary" className="w-full !py-2.5">Solicitar orçamento</LinkButton></div>
      </div>
    </article>
  );
}

export function PromoCard({ p, number }: { p: Promotion; number: string }) {
  const msg = `Olá! Vi a promoção "${p.title}" no site e quero aproveitar.`;
  return (
    <article className="grid overflow-hidden border border-gold-500/50 bg-forest-950 text-forest-100 md:grid-cols-[1fr_1.2fr]">
      <Photo src={p.image_url} placeholder="oficina" alt={p.title} className="min-h-56" sizes="(min-width:768px) 40vw, 100vw" />
      <div className="flex flex-col justify-center p-8">
        {p.ends_at && <p className="font-mono text-sm text-gold-300">Válida até {fmtDate(p.ends_at)}</p>}
        <h3 className="mt-2 !text-paper">{p.title}</h3>
        <p className="mt-3">{p.description}</p>
        <div className="mt-6"><LinkButton href={waLink(number, msg)} external variant="onDark">{p.cta_label || "Solicitar orçamento"}</LinkButton></div>
      </div>
    </article>
  );
}

export function PostCard({ p }: { p: Post }) {
  return (
    <Link href={`/blog/${p.slug}`} className="group block">
      <Photo src={p.image_url} placeholder="campo" alt={p.title} className="aspect-[3/2]" sizes="(min-width:1024px) 33vw, 100vw" />
      <p className="mt-4 font-mono text-xs text-forest-700">{[p.category, fmtLong(p.published_at)].filter(Boolean).join(" · ")}</p>
      <h3 className="mt-2 !text-xl group-hover:underline group-hover:decoration-gold-500 group-hover:underline-offset-4">{p.title}</h3>
      <p className="mt-2 text-[0.95rem] text-ink-muted">{p.excerpt}</p>
    </Link>
  );
}

export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-y hairline border-y hairline">
      {items.map((f) => (
        <details key={f.question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-semibold text-forest-900">
            {f.question}
            <span aria-hidden className="text-2xl text-gold-500 transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 max-w-[65ch] text-ink-muted">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function FinalCta({ title, subtitle, label, href }: { title?: string; subtitle?: string; label?: string; href: string }) {
  return (
    <section className="topo bg-forest-900">
      <div className="container-site section-y flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="!text-paper">{title}</h2>
          {subtitle && <p className="mt-4 text-lg text-forest-100">{subtitle}</p>}
        </div>
        <LinkButton href={href} external variant="wa" className="shrink-0 !px-8 !py-4">{label ?? "Chamar no WhatsApp"}</LinkButton>
      </div>
    </section>
  );
}
