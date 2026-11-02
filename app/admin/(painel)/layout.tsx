import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { RESOURCES } from "@/lib/admin/resources";
import { logout } from "../actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const s = await requireUser();
  const groups = ["Conteúdo", "Atendimento", "Site"];
  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="bg-forest-950 text-forest-100 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <div className="flex items-center justify-between p-5 lg:block">
          <Link href="/admin" className="font-display text-xl font-bold text-paper">Agrotechnica</Link>
          <p className="hidden text-xs text-forest-100/70 lg:mt-1 lg:block">{s.name}</p>
        </div>
        <nav aria-label="Painel" className="flex gap-1 overflow-x-auto px-3 pb-4 lg:block lg:space-y-6 lg:overflow-visible lg:px-4">
          {groups.map((g) => (
            <div key={g} className="flex gap-1 lg:block">
              <p className="mb-1 hidden px-2 font-mono text-xs text-gold-300 lg:block">{g}</p>
              {RESOURCES.filter((r) => r.group === g && (!r.adminOnly || s.role === "admin")).map((r) => (
                <Link key={r.key} href={`/admin/${r.key}`} className="block whitespace-nowrap rounded-md px-3 py-2 text-sm hover:bg-white/10">{r.label}</Link>
              ))}
              {g === "Conteúdo" && <Link href="/admin/midia" className="block whitespace-nowrap rounded-md px-3 py-2 text-sm hover:bg-white/10">Biblioteca de imagens</Link>}
            </div>
          ))}
        </nav>
        <div className="flex gap-4 border-t border-white/10 p-4 text-sm">
          <a href="/" target="_blank" className="underline underline-offset-4">Ver site</a>
          <form action={logout}><button className="underline underline-offset-4">Sair</button></form>
        </div>
      </aside>
      <div className="p-5 sm:p-8 lg:p-10">{children}</div>
    </div>
  );
}
