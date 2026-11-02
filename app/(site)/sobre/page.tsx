import { PageHero } from "@/components/site/PageHero";
import { Photo } from "@/components/ui/Photo";
import { FinalCta } from "@/components/site/Cards";
import { getSection, getTeam, getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { waLink } from "@/lib/whatsapp";

export const metadata = pageMeta("Sobre a Agrotechnica", "Suporte e inovação tecnológica para o agronegócio, com técnicos certificados em XAG, DJI e Eavision.", "/sobre");

export default async function Page() {
  const [h, team, s] = await Promise.all([getSection("sobre", "historia"), getTeam(), getSettings()]);
  return (
    <>
      <PageHero kicker="Sobre nós" title={h.title ?? "Sobre a Agrotechnica"} />
      <section className="section-y">
        <div className="container-site grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="prose-site">{(h.body ?? "").split("\n\n").map((p) => <p key={p}>{p}</p>)}</div>
          <Photo src={h.image_url} placeholder="oficina" alt="Oficina da Agrotechnica" className="aspect-[4/5] rounded-lg" />
        </div>
      </section>
      <section className="section-y bg-forest-100/50">
        <div className="container-site">
          <h2>Equipe técnica</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <article key={m.name}>
                <Photo src={m.photo_url} placeholder="equipe" alt={m.name} className="aspect-square rounded-lg" sizes="(min-width:1024px) 30vw, 100vw" />
                <h3 className="mt-4 !text-xl">{m.name}</h3>
                <p className="text-sm text-ink-muted">{m.role}</p>
                {m.bio && <p className="mt-2 text-[0.95rem]">{m.bio}</p>}
                {m.certifications.length > 0 && <ul className="mt-3 flex flex-wrap gap-2">{m.certifications.map((c) => <li key={c} className="rounded-sm border border-gold-500 px-2 py-0.5 font-mono text-xs text-forest-900">{c}</li>)}</ul>}
              </article>
            ))}
          </div>
        </div>
      </section>
      <FinalCta title="Vamos conversar sobre o seu equipamento?" href={waLink(s.whatsapp_number, "Olá! Vim pelo site da Agrotechnica.")} />
    </>
  );
}
