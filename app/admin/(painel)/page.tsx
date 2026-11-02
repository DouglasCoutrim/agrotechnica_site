import Link from "next/link";
import { q } from "@/lib/db";
import { waLink } from "@/lib/whatsapp";
import { getSettings } from "@/lib/queries";

export default async function Dashboard() {
  const safe = async <T,>(p: Promise<T>, f: T) => { try { return await p; } catch { return f; } };
  const [cnt, leads, s] = await Promise.all([
    safe(q<any>(`SELECT (SELECT COUNT(*) FROM leads WHERE status='novo') novos, (SELECT COUNT(*) FROM products) pecas,
      (SELECT COUNT(*) FROM services) servicos, (SELECT COUNT(*) FROM posts WHERE is_published=1) posts`), [{ novos: 0, pecas: 0, servicos: 0, posts: 0 }]),
    safe(q<any>("SELECT id, name, phone, interest, status, created_at FROM leads ORDER BY created_at DESC LIMIT 8"), []),
    getSettings(),
  ]);
  const c = cnt[0];
  const cards: [string, number, string][] = [["Contatos novos", c.novos, "/admin/contatos"], ["Peças", c.pecas, "/admin/pecas"], ["Serviços", c.servicos, "/admin/servicos"], ["Artigos publicados", c.posts, "/admin/blog"]];
  return (
    <div className="max-w-5xl">
      <h1 className="!text-3xl">Início</h1>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([l, n, h]) => (
          <li key={l}><Link href={h} className="block border border-forest-900/15 bg-white/60 p-5 hover:border-gold-500">
            <span className="font-display text-4xl font-bold text-forest-900">{n}</span><span className="mt-1 block text-sm text-ink-muted">{l}</span></Link></li>
        ))}
      </ul>
      <h2 className="mb-4 mt-12 !text-2xl">Últimos pedidos de contato</h2>
      {leads.length ? (
        <div className="overflow-x-auto"><table className="w-full text-left text-sm">
          <thead className="border-b border-forest-900/20 text-ink-muted"><tr><th className="py-2 pr-4">Nome</th><th className="pr-4">Interesse</th><th className="pr-4">Status</th><th>Ação</th></tr></thead>
          <tbody>{leads.map((l: any) => (
            <tr key={l.id} className="border-b border-forest-900/10">
              <td className="py-3 pr-4"><Link href={`/admin/contatos/${l.id}`} className="font-semibold underline underline-offset-4">{l.name}</Link></td>
              <td className="pr-4">{l.interest}</td><td className="pr-4">{l.status}</td>
              <td><a className="font-semibold text-forest-700 underline underline-offset-4" target="_blank" rel="noopener noreferrer"
                href={waLink("55" + String(l.phone).replace(/\D/g, "").replace(/^55/, ""), `Olá ${l.name}! Aqui é da Agrotechnica, recebemos seu pedido pelo site.`)}>Responder no WhatsApp</a></td>
            </tr>))}</tbody></table></div>
      ) : <p className="text-ink-muted">Nenhum pedido ainda.</p>}
      <p className="mt-10 text-sm text-ink-muted">WhatsApp do site: {s.whatsapp_number}. Para alterar, vá em Configurações gerais.</p>
    </div>
  );
}
