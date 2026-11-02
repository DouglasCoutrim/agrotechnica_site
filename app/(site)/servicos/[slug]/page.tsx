import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/PageHero";
import { Photo } from "@/components/ui/Photo";
import { LinkButton } from "@/components/ui/Button";
import { getServices, getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { waLink } from "@/lib/whatsapp";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P) {
  const { slug } = await params;
  const sv = (await getServices()).find((x) => x.slug === slug);
  return sv ? pageMeta(sv.title, sv.short_description, `/servicos/${slug}`) : {};
}

export default async function Page({ params }: P) {
  const { slug } = await params;
  const [list, s] = await Promise.all([getServices(), getSettings()]);
  const sv = list.find((x) => x.slug === slug);
  if (!sv) notFound();
  const msg = `Olá! Quero um orçamento do serviço: ${sv.title}.`;
  return (
    <>
      <PageHero kicker="Serviço" title={sv.title} intro={sv.short_description} />
      <section className="section-y">
        <div className="container-site grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <div className="prose-site">{sv.body.split("\n\n").map((p) => <p key={p}>{p}</p>)}</div>
            {sv.features.length > 0 && (
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {sv.features.map((f) => <li key={f} className="border-l-2 border-gold-500 pl-4 font-medium text-forest-900">{f}</li>)}
              </ul>
            )}
            <div className="mt-10"><LinkButton href={waLink(s.whatsapp_number, msg)} external variant="wa">Solicitar orçamento no WhatsApp</LinkButton></div>
          </div>
          <Photo src={sv.image_url} placeholder={sv.placeholder} alt={sv.title} className="aspect-[4/5] rounded-lg" />
        </div>
      </section>
    </>
  );
}
