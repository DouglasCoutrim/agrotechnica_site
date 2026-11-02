export function SectionHead({ kicker, title, intro, dark = false }:
  { kicker?: string; title: string; intro?: string; dark?: boolean }) {
  return (
    <header className="max-w-3xl">
      {kicker && (
        <p className={`mb-5 flex items-center gap-3 font-mono text-sm ${dark ? "text-gold-300" : "text-forest-700"}`}>
          <span aria-hidden className={`h-px w-10 ${dark ? "bg-gold-300" : "bg-gold-500"}`} />
          {kicker}
        </p>
      )}
      <h2 className={dark ? "!text-paper" : ""}>{title}</h2>
      {intro && <p className={`mt-5 max-w-[60ch] text-lg ${dark ? "text-forest-100" : "text-ink-muted"}`}>{intro}</p>}
    </header>
  );
}
