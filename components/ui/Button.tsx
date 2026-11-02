import Link from "next/link";

type Variant = "primary" | "secondary" | "onDark" | "wa";
const base = "group relative inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 font-semibold text-[0.95rem] transition-colors duration-200 overflow-hidden";
const styles: Record<Variant, string> = {
  primary: "bg-forest-900 text-paper hover:bg-forest-700 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-gold-500 after:transition-transform hover:after:scale-x-100",
  secondary: "border border-forest-900 text-forest-900 hover:bg-forest-900 hover:text-paper",
  onDark: "bg-gold-300 text-forest-950 hover:bg-paper",
  wa: "bg-wa text-white hover:brightness-110",
};

export function LinkButton({ href, variant = "primary", children, external, className = "" }:
  { href: string; variant?: Variant; children: React.ReactNode; external?: boolean; className?: string }) {
  const cls = `${base} ${styles[variant]} ${className}`;
  return external
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>
    : <Link href={href} className={cls}>{children}</Link>;
}
