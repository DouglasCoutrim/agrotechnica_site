import { notFound } from "next/navigation";
import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { LinkButton } from "@/components/ui/Button";
import { getProducts, getSettings } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";
import { waLink } from "@/lib/whatsapp";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P) {
  const { slug } = await params;
  const p = (await getProducts()).find((x) => x.slug === slug);
  return p ? pageMeta(`${p.name} original`, p.description || `${p.name} para drones agrícolas.`, `/pecas/${slug}`) : {};
}

export default async function Page({ params }: P) {
  const { slug } = await params;
  const [list, s] = await Promise.all([getProducts(), getSettings()]);
  const p = list.find((x) => x.slug === slug);
  if (!p) notFound();
  const msg = `Olá! Vi o produto ${p.name} no site da Agrotechnica e quero um orçamento.`;
  return (
    <section className="section-y">
      <div className="container-site">
        <nav aria-label="Você está em" className="mb-8 text-sm text-ink-muted">
          <Link href="/pecas" className="underline underline-offset-4">Peças</Link> / {p.name}
        </nav>
        <div className="grid gap-12 lg:grid-cols-2">
          <Photo src={p.image_url} placeholder={p.placeholder} alt={p.name} className="aspect-square rounded-lg" priority />
          <div>
            <p className="font-mono text-sm text-forest-700">{[p.brand, p.category].filter(Boolean).join(" · ")}</p>
            <h1 className="mt-2 !text-[clamp(2rem,3vw+1rem,3rem)]">{p.name}</h1>
            {p.in_stock && <p className="mt-4 inline-block rounded-sm bg-gold-300 px-3 py-1 font-mono text-sm text-forest-950">Pronta entrega</p>}
            <p className="mt-6 max-w-[55ch] text-ink-muted">{p.description}</p>
            <p className="mt-6 text-sm text-ink-muted">Informe o modelo do seu drone para confirmarmos a compatibilidade.</p>
            <div className="mt-8"><LinkButton href={waLink(s.whatsapp_number, msg)} external variant="wa">Solicitar orçamento no WhatsApp</LinkButton></div>
          </div>
        </div>
      </div>
    </section>
  );
}
