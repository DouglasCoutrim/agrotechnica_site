import { PageHero } from "@/components/site/PageHero";
import { ProductCard, FinalCta } from "@/components/site/Cards";
import { getProducts, getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { waLink } from "@/lib/whatsapp";

export const metadata = pageMeta("Peças originais para drones XAG e DJI", "Motores, hélices, ESCs, bombas, baterias, sensores e estruturas originais para drones agrícolas, com pronta entrega.", "/pecas");

export default async function Page() {
  const [list, s] = await Promise.all([getProducts(), getSettings()]);
  const cats = [...new Set(list.map((p) => p.category).filter(Boolean))];
  return (
    <>
      <PageHero kicker="Peças" title="Peças originais XAG e DJI, com pronta entrega" intro="Todos os valores sob consulta. Diga o modelo do seu drone e enviamos o orçamento pelo WhatsApp." />
      <section className="section-y">
        <div className="container-site">
          {cats.length > 0 && <p className="mb-8 text-sm text-ink-muted">Categorias: {cats.join(", ")}</p>}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.slug} p={p} number={s.whatsapp_number} />)}</div>
        </div>
      </section>
      <FinalCta title="Não achou a peça?" subtitle="Trabalhamos com mais itens além dos listados. Pergunte pelo modelo do seu equipamento." href={waLink(s.whatsapp_number, "Olá! Não encontrei uma peça no site. Podem me ajudar?")} />
    </>
  );
}
