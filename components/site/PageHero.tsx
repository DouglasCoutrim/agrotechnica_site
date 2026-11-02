export function PageHero({ kicker, title, intro }: { kicker?: string; title: string; intro?: string }) {
  return (
    <section className="topo bg-forest-950">
      <div className="container-site py-16 lg:py-24">
        {kicker && <p className="mb-5 flex items-center gap-3 font-mono text-sm text-gold-300"><span aria-hidden className="h-px w-10 bg-gold-300" />{kicker}</p>}
        <h1 className="max-w-4xl !text-paper">{title}</h1>
        {intro && <p className="mt-6 max-w-[60ch] text-lg text-forest-100">{intro}</p>}
      </div>
    </section>
  );
}
