import { PageHero } from "@/components/site/PageHero";
import { Photo } from "@/components/ui/Photo";
import { FaqList, FinalCta } from "@/components/site/Cards";
import { getFaqs, getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { waLink } from "@/lib/whatsapp";

export const metadata = pageMeta("Piloto automático Topcon e sinal RTK de 2 cm", "Linha completa de pilotos automáticos Topcon, telas, receptores e sinal RTK Topcon e Trimble com ativação imediata. Starpoint PRO com até 2,5 cm.", "/gps-piloto-automatico");

const itens = [
  ["Piloto automático Topcon", "Linha completa de pilotos automáticos, telas e receptores de GPS agrícola de precisão."],
  ["Sinal RTK de 2 cm", "Para as linhas Topcon e Trimble. Você paga apenas pelo que consumir, sem anuidade forçada na entressafra."],
  ["Starpoint PRO", "Precisão de até 2,5 cm, menos falhas, menos desperdício e menos custo durante toda a safra."],
  ["Ativação imediata", "Venda de planos de sinal de alta precisão com ativação rápida, sem esperar."],
];

export default async function Page() {
  const [faqs, s] = await Promise.all([getFaqs("gps"), getSettings()]);
  return (
    <>
      <PageHero kicker="GPS agrícola" title="Precisão de 2 cm para cada linha de plantio" intro="Piloto automático, telas, receptores e sinal RTK para Topcon e Trimble." />
      <section className="section-y">
        <div className="container-site grid items-start gap-12 lg:grid-cols-[1.2fr_1fr]">
          <dl className="grid gap-8 sm:grid-cols-2">
            {itens.map(([t, d]) => (
              <div key={t} className="border-t-2 border-gold-500 pt-4">
                <dt className="font-display text-xl font-semibold text-forest-900">{t}</dt><dd className="mt-2 text-ink-muted">{d}</dd>
              </div>
            ))}
          </dl>
          <Photo src={null} placeholder="gps" alt="Tela de GPS agrícola" className="aspect-[4/3] rounded-lg" />
        </div>
      </section>
      <section className="section-y bg-forest-100/50"><div className="container-site max-w-4xl"><FaqList items={faqs} /></div></section>
      <FinalCta title="Quer ativar o sinal ou instalar o piloto?" subtitle="Informe o modelo da sua máquina e o tamanho da área." href={waLink(s.whatsapp_number, "Olá! Quero saber mais sobre piloto automático e sinal RTK.")} />
    </>
  );
}
