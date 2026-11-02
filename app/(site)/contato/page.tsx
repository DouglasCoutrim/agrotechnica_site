import { PageHero } from "@/components/site/PageHero";
import { ContactForm } from "./ContactForm";
import { getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Contato e orçamento", "Fale com a Agrotechnica em Cristalina-GO: orçamento de peças, manutenção de drones e baterias, GPS e sinal RTK.", "/contato");

export default async function Page() {
  const s = await getSettings();
  return (
    <>
      <PageHero kicker="Contato" title="Peça seu orçamento" intro="Quanto mais detalhes (marca, modelo, defeito), mais rápida a resposta." />
      <section className="section-y">
        <div className="container-site grid gap-14 lg:grid-cols-[1.3fr_1fr]">
          <ContactForm number={s.whatsapp_number} />
          <aside className="space-y-6 text-ink">
            <div><h2 className="!text-xl">Endereço</h2><p className="mt-2">{s.address}</p>
              {s.maps_link && <a className="mt-1 inline-block font-semibold text-forest-700 underline underline-offset-4" href={s.maps_link} target="_blank" rel="noopener noreferrer">Como chegar</a>}</div>
            <div><h2 className="!text-xl">Horários</h2><ul className="mt-2">{s.opening_hours.map((h) => <li key={h.dia}>{h.dia}: {h.horario}</li>)}</ul></div>
          </aside>
        </div>
      </section>
    </>
  );
}
