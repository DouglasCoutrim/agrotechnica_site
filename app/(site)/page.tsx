import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { SectionHead } from "@/components/ui/SectionHead";
import { ServiceCard, ProductCard, PromoCard, FaqList, FinalCta } from "@/components/site/Cards";
import { getSection, getServices, getProducts, getPromotions, getTestimonials, getFaqs, getSettings } from "@/lib/queries";
import { waLink } from "@/lib/whatsapp";

export const revalidate = 300;

export default async function Home() {
  const [hero, dif, bat, gps, cta, services, products, promos, depo, faqs, s] = await Promise.all([
    getSection("home", "hero"), getSection("home", "diferenciais"), getSection("home", "baterias"),
    getSection("home", "gps"), getSection("home", "cta"), getServices(), getProducts(),
    getPromotions(), getTestimonials(), getFaqs("home"), getSettings(),
  ]);
  const items: { t: string; d: string }[] = dif.extra?.items ?? [];

  return (
    <>
      {/* HERO: o título é o protagonista; a foto real do Agras sustenta */}
      <section className="topo relative overflow-hidden bg-forest-950">
        <div className="container-site grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <p className="mb-6 flex items-center gap-3 font-mono text-sm text-gold-300">
              <span aria-hidden className="h-px w-10 bg-gold-300" />{hero.eyebrow}
            </p>
            <h1 className="!text-[clamp(2.5rem,5.2vw+1rem,5rem)] !text-paper">{hero.title}</h1>
            <p className="mt-6 max-w-[52ch] text-lg text-forest-100">{hero.subtitle}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <LinkButton href={hero.cta_url ?? "/contato"} variant="onDark">{hero.cta_label}</LinkButton>
              <LinkButton href={hero.extra?.secondary_url ?? "/servicos"} variant="secondary" className="!border-paper/60 !text-paper hover:!bg-paper hover:!text-forest-950">{hero.extra?.secondary_label}</LinkButton>
            </div>
          </div>
          <div className="relative">
            <Photo src={hero.image_url ?? "/brand/drone-agras.jpg"} alt="Drone agrícola XAG em operação sobre lavoura" priority
              className="aspect-[4/3] rounded-lg ring-1 ring-gold-500/40" sizes="(min-width:1024px) 45vw, 100vw" />
            <p className="absolute -bottom-4 left-4 rounded-sm bg-gold-300 px-3 py-1.5 font-mono text-xs font-medium text-forest-950">
              Peças e manutenção XAG · DJI · Eavision
            </p>
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="section-y">
        <div className="container-site grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <SectionHead title={dif.title ?? ""} />
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {items.map((i) => (
              <div key={i.t} className="border-t-2 border-gold-500 pt-4">
                <dt className="font-display text-xl font-semibold text-forest-900">{i.t}</dt>
                <dd className="mt-2 text-ink-muted">{i.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section className="section-y bg-forest-100/50">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead kicker="Serviços" title="Manutenção que devolve o equipamento ao campo" />
            <Link href="/servicos" className="font-semibold text-forest-700 underline decoration-gold-500 underline-offset-4">Ver todos os serviços</Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 4).map((x) => <ServiceCard key={x.slug} s={x} />)}
          </div>
        </div>
      </section>

      {/* BATERIAS: o diferencial */}
      <section className="topo bg-forest-950">
        <div className="container-site section-y grid items-center gap-12 lg:grid-cols-2">
          <Photo src={bat.image_url ?? "/brand/bateria-dji.jpg"} alt="Bateria DJI Agras" className="aspect-[5/4] rounded-lg ring-1 ring-gold-500/40" sizes="(min-width:1024px) 45vw, 100vw" />
          <div>
            <SectionHead dark kicker={bat.eyebrow} title={bat.title ?? ""} />
            <p className="mt-6 max-w-[55ch] text-forest-100">{bat.body}</p>
            <div className="mt-8"><LinkButton href={bat.cta_url ?? "/servicos"} variant="onDark">{bat.cta_label}</LinkButton></div>
          </div>
        </div>
      </section>

      {/* PEÇAS */}
      <section className="section-y">
        <div className="container-site">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead kicker="Peças originais" title="Pronta entrega para não perder a janela de aplicação" />
            <Link href="/pecas" className="font-semibold text-forest-700 underline decoration-gold-500 underline-offset-4">Ver catálogo completo</Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => <ProductCard key={p.slug} p={p} number={s.whatsapp_number} />)}
          </div>
        </div>
      </section>

      {/* GPS / RTK */}
      <section className="bg-forest-100/50">
        <div className="container-site section-y grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHead kicker={gps.eyebrow} title={gps.title ?? ""} />
            <p className="mt-6 max-w-[55ch] text-ink-muted">{gps.body}</p>
            <div className="mt-8"><LinkButton href={gps.cta_url ?? "/gps-piloto-automatico"}>{gps.cta_label}</LinkButton></div>
          </div>
          <Photo src={gps.image_url} placeholder="gps" alt="Piloto automático e GPS agrícola" className="aspect-[3/2] rounded-lg" />
        </div>
      </section>

      {/* PROMOÇÕES (só aparece se houver ativa) */}
      {promos.length > 0 && (
        <section className="section-y">
          <div className="container-site">
            <SectionHead kicker="Promoções" title="Ofertas em andamento" />
            <div className="mt-10 grid gap-6">{promos.slice(0, 2).map((p) => <PromoCard key={p.title} p={p} number={s.whatsapp_number} />)}</div>
          </div>
        </section>
      )}

      {/* DEPOIMENTOS */}
      <section className="section-y">
        <div className="container-site">
          <SectionHead kicker="Clientes" title="Quem usa, recomenda" />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {depo.slice(0, 3).map((d) => (
              <figure key={d.content} className="border-l-2 border-gold-500 pl-6">
                <blockquote className="text-lg text-ink">“{d.content}”</blockquote>
                <figcaption className="mt-4 text-sm text-ink-muted"><span className="font-semibold text-forest-900">{d.author}</span>{d.role && `, ${d.role}`}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y bg-forest-100/50">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHead kicker="Dúvidas" title="Perguntas frequentes" />
          <FaqList items={faqs} />
        </div>
      </section>

      <FinalCta title={cta.title} subtitle={cta.subtitle} label={cta.cta_label}
        href={waLink(s.whatsapp_number, "Olá! Vim pelo site da Agrotechnica e gostaria de falar com um especialista.")} />
    </>
  );
}
