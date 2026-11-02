import Link from "next/link";
import Image from "next/image";
import { getSettings } from "@/lib/queries";
import { waLink } from "@/lib/whatsapp";

export async function Footer() {
  const s = await getSettings();
  const embed = s.maps_embed_url || `https://www.google.com/maps?q=${encodeURIComponent(`${s.address}, ${s.state}`)}&output=embed`;
  const social = [
    { label: "Instagram", url: s.instagram_url }, { label: "Facebook", url: s.facebook_url },
    { label: "YouTube", url: s.youtube_url }, { label: "LinkedIn", url: s.linkedin_url },
  ].filter((x) => x.url);

  return (
    <footer className="topo relative bg-forest-950 text-forest-100">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/brand/logo.jpg" alt="" width={52} height={52} className="rounded-sm" />
            <span className="font-display text-xl font-bold text-paper">{s.company_name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-forest-100/80">{s.tagline}. Peças originais, manutenção especializada e GPS agrícola.</p>
          <a href={waLink(s.whatsapp_number, "Olá! Vim pelo site da Agrotechnica.")} target="_blank" rel="noopener noreferrer"
            className="mt-5 inline-block font-semibold text-gold-300 underline underline-offset-4">
            WhatsApp {s.whatsapp_number.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3")}
          </a>
          {s.email && <p className="mt-2 text-sm">{s.email}</p>}
        </div>

        <nav aria-label="Links úteis">
          <h3 className="mb-4 !text-base !text-paper">Links úteis</h3>
          <ul className="space-y-2 text-sm">
            {[["/servicos", "Serviços"], ["/pecas", "Peças"], ["/gps-piloto-automatico", "GPS e piloto automático"], ["/promocoes", "Promoções"],
              ["/portfolio", "Portfólio"], ["/blog", "Blog"], ["/sobre", "Sobre"], ["/contato", "Contato"]].map(([h, l]) => (
              <li key={h}><Link href={h} className="hover:text-gold-300">{l}</Link></li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="mb-4 !text-base !text-paper">Horários</h3>
          <ul className="space-y-2 text-sm">
            {s.opening_hours.map((h) => <li key={h.dia}>{h.dia}: {h.horario}</li>)}
          </ul>
          {social.length > 0 && (
            <>
              <h3 className="mb-3 mt-8 !text-base !text-paper">Redes sociais</h3>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {social.map((x) => <li key={x.label}><a href={x.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-gold-300">{x.label}</a></li>)}
              </ul>
            </>
          )}
        </div>

        <div>
          <h3 className="mb-4 !text-base !text-paper">Onde estamos</h3>
          <p className="mb-3 text-sm">{s.address}</p>
          <iframe title="Mapa da Agrotechnica" src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            className="h-44 w-full rounded-md border border-white/10 grayscale-[30%]" />
          {s.maps_link && <a href={s.maps_link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-gold-300 underline underline-offset-4">Como chegar</a>}
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-forest-100/60">
        © {new Date().getFullYear()} {s.company_name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
