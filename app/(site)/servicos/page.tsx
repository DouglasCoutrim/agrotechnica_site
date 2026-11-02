import { PageHero } from "@/components/site/PageHero";
import { ServiceCard, FinalCta } from "@/components/site/Cards";
import { getServices, getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { waLink } from "@/lib/whatsapp";

export const metadata = pageMeta("Serviços de manutenção de drones, baterias e geradores", "Manutenção de drones XAG, DJI e Eavision, recuperação de baterias DJI Agras e XAG, geradores e sinal RTK em Cristalina-GO.", "/servicos");

export default async function Page() {
  const [list, s] = await Promise.all([getServices(), getSettings()]);
  return (
    <>
      <PageHero kicker="Serviços" title="Manutenção especializada para a operação não parar" intro="Técnicos certificados em cada marca e uma oficina de baterias que recupera o que outras descartam." />
      <section className="section-y"><div className="container-site grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{list.map((x) => <ServiceCard key={x.slug} s={x} />)}</div></section>
      <FinalCta title="Não sabe qual serviço precisa?" subtitle="Descreva o problema e indicamos o caminho." href={waLink(s.whatsapp_number, "Olá! Preciso de ajuda para identificar o problema do meu equipamento.")} />
    </>
  );
}
