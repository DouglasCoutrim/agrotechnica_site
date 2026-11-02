import Link from "next/link";
import { notFound } from "next/navigation";
import { q } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { byKey } from "@/lib/admin/resources";
import { deleteRecord, seedSections } from "../../actions";
import { ConfirmButton } from "@/components/admin/Client";

type P = { params: Promise<{ resource: string }>; searchParams: Promise<{ ok?: string; erro?: string }> };
const cell = (v: any) => (v === null || v === undefined || v === "" ? "—" : typeof v === "string" ? (v.length > 70 ? v.slice(0, 70) + "…" : v) : v === 1 ? "Sim" : v === 0 ? "Não" : String(v));

export default async function Page({ params, searchParams }: P) {
  const { resource } = await params;
  const sp = await searchParams;
  const res = byKey(resource);
  const s = await requireUser(res?.adminOnly);
  if (!res || res.singleton) notFound();
  let rows: any[] = []; let dbError = false;
  try { rows = await q(`SELECT * FROM ${res.table} ORDER BY ${res.order} LIMIT 300`); } catch { dbError = true; }
  const boolCols = new Set(res.fields.filter((f) => f.type === "bool").map((f) => f.name));

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="!text-3xl">{res.label}</h1>
        <div className="flex gap-3">
          {res.key === "secoes" && <form action={seedSections}><button className="rounded-md border border-forest-900/30 px-4 py-2.5 text-sm font-semibold hover:bg-forest-100">Criar textos padrão</button></form>}
          {!res.noCreate && <Link href={`/admin/${res.key}/novo`} className="rounded-md bg-forest-900 px-5 py-2.5 font-semibold text-paper hover:bg-forest-700">Novo {res.singular}</Link>}
        </div>
      </div>
      {res.hint && <p className="mt-3 max-w-2xl text-sm text-ink-muted">{res.hint}</p>}
      {sp.ok && <p role="status" className="mt-5 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-green-900">Salvo. O site já foi atualizado.</p>}
      {sp.erro && <p role="alert" className="mt-5 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800">{sp.erro}</p>}
      {dbError && <p role="alert" className="mt-5 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800">Não foi possível ler o banco de dados. Confira as variáveis DB_* e se o schema.sql foi importado.</p>}

      {rows.length ? (
        <div className="mt-8 overflow-x-auto"><table className="w-full text-left text-sm">
          <thead className="border-b border-forest-900/20 text-ink-muted"><tr>
            {res.columns.map((c) => <th key={c} className="py-2 pr-4 font-semibold">{res.fields.find((f) => f.name === c)?.label ?? c}</th>)}<th className="text-right">Ações</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id ?? r.route} className="border-b border-forest-900/10">
              {res.columns.map((c, i) => <td key={c} className="py-3 pr-4">{i === 0
                ? <Link href={`/admin/${res.key}/${r.id}`} className="font-semibold text-forest-900 underline underline-offset-4">{cell(r[c])}</Link>
                : boolCols.has(c) ? (r[c] ? "Sim" : "Não") : cell(r[c])}</td>)}
              <td className="space-x-4 text-right whitespace-nowrap">
                <Link href={`/admin/${res.key}/${r.id}`} className="font-semibold text-forest-700 underline underline-offset-4">Editar</Link>
                {!(res.key === "usuarios" && r.id === s.uid) && (
                  <form action={deleteRecord.bind(null, res.key, r.id)} className="inline">
                    <ConfirmButton message={`Excluir este(a) ${res.singular}? Não dá para desfazer.`} className="font-semibold text-red-700 underline underline-offset-4">Excluir</ConfirmButton>
                  </form>)}
              </td>
            </tr>))}</tbody></table></div>
      ) : !dbError && <p className="mt-10 text-ink-muted">Nada cadastrado ainda.</p>}
    </div>
  );
}
