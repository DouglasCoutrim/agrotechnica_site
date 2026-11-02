import { q } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { byKey } from "@/lib/admin/resources";
import { RecordForm } from "@/components/admin/RecordForm";

type P = { searchParams: Promise<{ ok?: string; erro?: string }> };

export default async function Page({ searchParams }: P) {
  await requireUser();
  const sp = await searchParams;
  const res = byKey("configuracoes")!;
  let row: Record<string, any> | null = null;
  try { [row = null] = await q("SELECT * FROM site_settings WHERE id=1"); } catch { /* banco vazio */ }
  return (
    <div>
      <h1 className="mb-6 !text-3xl">{res.label}</h1>
      {sp.ok && <p role="status" className="mb-6 max-w-3xl rounded-md border border-green-300 bg-green-50 px-4 py-3 text-green-900">Salvo. O site já foi atualizado.</p>}
      <RecordForm res={res} id="1" row={row} error={sp.erro} />
    </div>
  );
}
