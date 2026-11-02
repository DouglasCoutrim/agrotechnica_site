import { PageHero } from "@/components/site/PageHero";
import { PromoCard } from "@/components/site/Cards";
import { LinkButton } from "@/components/ui/Button";
import { getPromotions, getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { waLink } from "@/lib/whatsapp";

export const metadata = pageMeta("Promoções", "Ofertas ativas em peças, produtos e serviços da Agrotechnica.", "/promocoes");

export default async function Page() {
  const [list, s] = await Promise.all([getPromotions(), getSettings()]);
  return (
    <>
      <PageHero kicker="Promoções" title="Ofertas em andamento" />
      <section className="section-y">
        <div className="container-site grid gap-6">
          {list.length ? list.map((p) => <PromoCard key={p.title} p={p} number={s.whatsapp_number} />) : (
            <div className="max-w-xl">
              <p className="text-lg">Não há promoções ativas agora. Chame no WhatsApp e consulte condições especiais.</p>
              <div className="mt-6"><LinkButton href={waLink(s.whatsapp_number, "Olá! Quero saber das próximas promoções.")} external variant="wa">Falar no WhatsApp</LinkButton></div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
