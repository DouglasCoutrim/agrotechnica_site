import Link from "next/link";
import { notFound } from "next/navigation";
import { q } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { byKey } from "@/lib/admin/resources";
import { RecordForm } from "@/components/admin/RecordForm";

type P = { params: Promise<{ resource: string; id: string }>; searchParams: Promise<{ erro?: string }> };

export default async function Page({ params, searchParams }: P) {
  const { resource, id } = await params;
  const { erro } = await searchParams;
  const res = byKey(resource);
  await requireUser(res?.adminOnly);
  if (!res || res.singleton || (id !== "novo" && !/^\d+$/.test(id)) || (id === "novo" && res.noCreate)) notFound();
  let row: Record<string, any> | null = null;
  if (id !== "novo") { [row = null] = await q(`SELECT * FROM ${res.table} WHERE id=?`, [Number(id)]); if (!row) notFound(); }
  return (
    <div>
      <p className="mb-2 text-sm"><Link href={`/admin/${res.key}`} className="text-forest-700 underline underline-offset-4">← {res.label}</Link></p>
      <h1 className="mb-8 !text-3xl">{id === "novo" ? `Novo ${res.singular}` : `Editar ${res.singular}`}</h1>
      <RecordForm res={res} id={id} row={row} error={erro} />
    </div>
  );
}
