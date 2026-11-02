import { PageHero } from "@/components/site/PageHero";
import { Photo } from "@/components/ui/Photo";
import { getPortfolio } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Trabalhos realizados", "Baterias recuperadas, drones revisados e sinal RTK ativado pela equipe da Agrotechnica.", "/portfolio");

export default async function Page() {
  const items = await getPortfolio();
  return (
    <>
      <PageHero kicker="Portfólio" title="Trabalhos que voltaram para o campo" />
      <section className="section-y">
        <div className="container-site grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i, n) => (
            <figure key={i.slug}>
              <Photo src={i.image_url} placeholder={["bateria", "oficina", "drone"][n % 3]} alt={i.title} className="aspect-[4/3] rounded-lg" sizes="(min-width:1024px) 33vw, 100vw" />
              <figcaption className="mt-4">
                <p className="font-mono text-xs text-forest-700">{i.category}</p>
                <h2 className="mt-1 !text-xl">{i.title}</h2>
                <p className="mt-2 text-sm text-ink-muted">{i.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
