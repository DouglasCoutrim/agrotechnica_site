import { q } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { deleteMedia } from "../../actions";
import { UploadBox, ConfirmButton } from "@/components/admin/Client";

export default async function Page({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  await requireUser();
  const sp = await searchParams;
  let items: { id: number; url: string; alt_text: string; width: number; height: number }[] = [];
  try { items = await q("SELECT id, url, alt_text, width, height FROM media ORDER BY id DESC LIMIT 200"); } catch { /* sem banco */ }
  return (
    <div className="max-w-5xl">
      <h1 className="!text-3xl">Biblioteca de imagens</h1>
      <p className="mb-6 mt-2 max-w-2xl text-sm text-ink-muted">Envie as fotos aqui ou direto no campo de imagem de cada cadastro. Ao excluir uma imagem, os locais onde ela era usada voltam a mostrar a ilustração padrão.</p>
      {sp.ok && <p role="status" className="mb-6 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-green-900">Pronto.</p>}
      <UploadBox />
      <ul className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((m) => (
          <li key={m.id} className="border border-forest-900/15 bg-white/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.url} alt={m.alt_text ?? ""} className="aspect-square w-full object-cover" loading="lazy" />
            <div className="flex items-center justify-between p-3 text-xs">
              <span className="text-ink-muted">{m.width}×{m.height}</span>
              <form action={deleteMedia.bind(null, m.id)}><ConfirmButton message="Excluir esta imagem?" className="font-semibold text-red-700 underline underline-offset-4">Excluir</ConfirmButton></form>
            </div>
          </li>
        ))}
      </ul>
      {!items.length && <p className="mt-10 text-ink-muted">Nenhuma imagem enviada ainda.</p>}
    </div>
  );
}
