import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { getSettings, getWhatsAppMessages } from "@/lib/queries";
import { SITE_URL } from "@/lib/seo";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [s, wa] = await Promise.all([getSettings(), getWhatsAppMessages()]);
  const ld = {
    "@context": "https://schema.org", "@type": "LocalBusiness", name: s.company_name, url: SITE_URL,
    image: `${SITE_URL}/brand/logo.jpg`, telephone: `+${s.whatsapp_number}`,
    address: { "@type": "PostalAddress", addressLocality: s.city, addressRegion: s.state, addressCountry: "BR" },
    sameAs: [s.instagram_url, s.facebook_url].filter(Boolean),
  };
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-gold-300 focus:px-4 focus:py-2">Ir para o conteúdo</a>
      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
      <WhatsAppFloat number={s.whatsapp_number} messages={wa} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
