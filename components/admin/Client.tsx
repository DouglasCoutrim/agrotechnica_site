"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type M = { id: number; url: string; alt_text?: string };
const btn = "rounded-md border border-forest-900/30 px-3 py-2 text-sm font-semibold hover:bg-forest-100";

async function upload(file: File): Promise<M> {
  const fd = new FormData(); fd.append("file", file);
  const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "Falha no envio.");
  return j;
}

export function MediaPicker({ name, initial }: { name: string; initial?: M | null }) {
  const [sel, setSel] = useState<M | null>(initial ?? null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<M[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => { if (open) fetch("/api/admin/media").then((r) => r.json()).then(setItems).catch(() => setErr("Não foi possível carregar a biblioteca.")); }, [open]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true); setErr("");
    try { const m = await upload(f); setSel(m); setOpen(false); } catch (x: any) { setErr(x.message); }
    setBusy(false); e.target.value = "";
  }

  return (
    <div>
      <input type="hidden" name={name} value={sel?.id ?? ""} />
      <div className="flex items-center gap-4">
        <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-md border border-forest-900/20 bg-forest-100 text-xs text-ink-muted">
          {sel ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={sel.url} alt="" className="h-full w-full object-cover" /> : "Sem imagem"}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn} onClick={() => setOpen(true)}>{sel ? "Trocar imagem" : "Escolher imagem"}</button>
          {sel && <button type="button" className={btn} onClick={() => setSel(null)}>Remover</button>}
        </div>
      </div>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Biblioteca de imagens" className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-paper p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="!text-xl">Biblioteca de imagens</h3>
              <button type="button" className={btn} onClick={() => setOpen(false)}>Fechar</button>
            </div>
            <label className={`${btn} inline-block cursor-pointer bg-forest-900 !text-paper hover:!bg-forest-700`}>
              {busy ? "Enviando..." : "Enviar nova imagem"}
              <input type="file" accept="image/*" className="sr-only" onChange={onFile} disabled={busy} />
            </label>
            {err && <p role="alert" className="mt-3 text-sm text-red-700">{err}</p>}
            <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((m) => (
                <li key={m.id}>
                  <button type="button" onClick={() => { setSel(m); setOpen(false); }} className="block w-full overflow-hidden rounded-md border-2 border-transparent hover:border-gold-500 focus-visible:border-gold-500">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.url} alt={m.alt_text ?? ""} className="aspect-square w-full object-cover" loading="lazy" />
                  </button>
                </li>
              ))}
            </ul>
            {!items.length && <p className="mt-5 text-sm text-ink-muted">Nenhuma imagem ainda. Envie a primeira.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export function UploadBox() {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<{ busy: boolean; msg: string }>({ busy: false, msg: "" });

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []); if (!files.length) return;
    setState({ busy: true, msg: "" });
    let ok = 0; let last = "";
    for (const f of files) { try { await upload(f); ok++; } catch (x: any) { last = `${f.name}: ${x.message}`; } }
    setState({ busy: false, msg: `${ok} de ${files.length} enviada(s).${last ? " " + last : ""}` });
    if (ref.current) ref.current.value = "";
    router.refresh();
  }

  return (
    <div>
      <label className="inline-block cursor-pointer rounded-md bg-forest-900 px-5 py-3 font-semibold text-paper hover:bg-forest-700">
        {state.busy ? "Enviando..." : "Enviar imagens"}
        <input ref={ref} type="file" accept="image/*" multiple className="sr-only" onChange={onChange} disabled={state.busy} />
      </label>
      <p role="status" className="mt-3 text-sm text-ink-muted">{state.msg || "JPG, PNG ou WebP, até 12 MB. As imagens são otimizadas automaticamente."}</p>
    </div>
  );
}

export function ConfirmButton({ children, message, className = "" }: { children: React.ReactNode; message: string; className?: string }) {
  return <button type="submit" className={className} onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>{children}</button>;
}
