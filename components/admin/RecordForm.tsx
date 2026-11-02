import Link from "next/link";
import { q, json } from "@/lib/db";
import { saveRecord } from "@/app/admin/actions";
import { MediaPicker } from "./Client";
import type { Resource, Field } from "@/lib/admin/resources";

const inp = "w-full rounded-md border border-forest-900/25 bg-white px-3 py-2.5 focus:border-gold-500 focus:outline-none";

function display(f: Field, v: any): string {
  if (v == null) return f.default != null && f.type !== "bool" ? String(f.default) : "";
  if (f.type === "list") return json<string[]>(v, []).join("\n");
  if (f.type === "hours") return json<{ dia: string; horario: string }[]>(v, []).map((h) => `${h.dia} | ${h.horario}`).join("\n");
  if (f.type === "json") return typeof v === "string" ? JSON.stringify(JSON.parse(v), null, 2) : JSON.stringify(v, null, 2);
  if (f.type === "datetime") return String(v).replace(" ", "T").slice(0, 16);
  if (f.type === "date") return String(v).slice(0, 10);
  return String(v);
}

export async function RecordForm({ res, id, row, error }: { res: Resource; id: string; row: Record<string, any> | null; error?: string }) {
  const refs: Record<string, { id: number; label: string }[]> = {};
  for (const f of res.fields.filter((x) => x.type === "ref"))
    refs[f.name] = await q(`SELECT id, ${f.ref!.label} AS label FROM ${f.ref!.table} ORDER BY ${f.ref!.label}`);
  const mediaIds = res.fields.filter((f) => f.type === "media").map((f) => row?.[f.name]).filter(Boolean);
  const media = mediaIds.length ? await q<{ id: number; url: string }>(`SELECT id, url FROM media WHERE id IN (${mediaIds.map(() => "?").join(",")})`, mediaIds) : [];

  const action = saveRecord.bind(null, res.key, id);
  return (
    <form action={action} className="max-w-3xl space-y-6">
      {error && <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-800">{error}</p>}
      {res.fields.map((f) => {
        const v = row?.[f.name];
        const label = <span className="mb-1 block text-sm font-semibold text-forest-900">{f.label}{f.required && <span className="text-red-700"> *</span>}</span>;
        const help = f.help && <span className="mt-1 block text-xs text-ink-muted">{f.help}</span>;
        let input: React.ReactNode;
        switch (f.type) {
          case "textarea": case "list": case "hours": case "json":
            input = <textarea name={f.name} rows={f.type === "textarea" ? 5 : 6} defaultValue={display(f, v)} className={`${inp} ${f.type === "json" ? "font-mono text-sm" : ""}`} maxLength={f.max} />; break;
          case "bool":
            input = <span className="flex items-center gap-3"><input type="checkbox" name={f.name} defaultChecked={row ? !!v : !!f.default} className="h-5 w-5 accent-[#0F3D2A]" /><span className="font-semibold text-forest-900">{f.label}</span></span>; break;
          case "select":
            input = <select name={f.name} defaultValue={v ?? f.default ?? ""} className={inp}>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>; break;
          case "ref":
            input = <select name={f.name} defaultValue={v ?? ""} className={inp}><option value="">— nenhum —</option>{refs[f.name].map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select>; break;
          case "media":
            input = <MediaPicker name={f.name} initial={media.find((m) => m.id === v) ?? null} />; break;
          case "readonly":
            input = <p className="whitespace-pre-wrap rounded-md bg-forest-100/60 px-3 py-2.5">{v == null || v === "" ? "—" : String(v)}</p>; break;
          case "password":
            input = <input type="password" name={f.name} autoComplete="new-password" minLength={10} className={inp} />; break;
          case "number": input = <input type="number" name={f.name} defaultValue={display(f, v)} className={inp} />; break;
          case "date": input = <input type="date" name={f.name} defaultValue={display(f, v)} className={inp} />; break;
          case "datetime": input = <input type="datetime-local" name={f.name} defaultValue={display(f, v)} className={inp} />; break;
          default: input = <input type="text" name={f.name} defaultValue={display(f, v)} className={inp} maxLength={f.max} />;
        }
        return f.type === "bool"
          ? <div key={f.name}>{input}{help}</div>
          : <label key={f.name} className="block">{label}{input}{help}</label>;
      })}
      <div className="flex items-center gap-4 border-t border-forest-900/15 pt-6">
        <button className="rounded-md bg-forest-900 px-8 py-3 font-semibold text-paper hover:bg-forest-700">Salvar</button>
        {!res.singleton && <Link href={`/admin/${res.key}`} className="font-semibold text-forest-700 underline underline-offset-4">Cancelar</Link>}
      </div>
    </form>
  );
}
