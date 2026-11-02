"use client";
import { useState } from "react";
import { waLink } from "@/lib/whatsapp";

const field = "w-full border-0 border-b-2 border-forest-900/30 bg-transparent px-0 py-3 text-ink placeholder:text-ink-muted/70 focus:border-gold-500 focus:outline-none";

export function ContactForm({ number }: { number: string }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [wa, setWa] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("sending");
    const res = await fetch("/api/contato", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) return setState("error");
    setWa(waLink(number, `Olá! Acabei de enviar o formulário no site. Meu nome é ${data.name}. Interesse: ${data.interest}.`));
    setState("ok");
  }

  if (state === "ok") return (
    <div role="status" className="border-l-2 border-gold-500 pl-6">
      <h2 className="!text-2xl">Recebemos seu pedido</h2>
      <p className="mt-3">Respondemos em horário comercial. Para agilizar, chame também no WhatsApp.</p>
      <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block rounded-md bg-wa px-6 py-3 font-semibold text-white">Chamar no WhatsApp</a>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="grid gap-6" noValidate>
      <label className="block"><span className="text-sm font-semibold">Nome</span><input name="name" required maxLength={120} autoComplete="name" className={field} /></label>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block"><span className="text-sm font-semibold">WhatsApp</span><input name="phone" required inputMode="tel" autoComplete="tel" maxLength={30} className={field} placeholder="(61) 90000-0000" /></label>
        <label className="block"><span className="text-sm font-semibold">E-mail (opcional)</span><input name="email" type="email" maxLength={150} autoComplete="email" className={field} /></label>
      </div>
      <label className="block"><span className="text-sm font-semibold">O que você precisa?</span>
        <select name="interest" className={field} defaultValue="Peças">
          {["Peças", "Manutenção de bateria", "Manutenção de drone", "Manutenção de gerador", "GPS e piloto automático", "Sinal RTK", "Outro"].map((o) => <option key={o}>{o}</option>)}
        </select></label>
      <label className="block"><span className="text-sm font-semibold">Detalhes (marca, modelo, defeito)</span><textarea name="message" rows={4} maxLength={2000} className={field} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div>
        <button disabled={state === "sending"} className="rounded-md bg-forest-900 px-8 py-3.5 font-semibold text-paper transition-colors hover:bg-forest-700 disabled:opacity-60">
          {state === "sending" ? "Enviando..." : "Enviar pedido"}
        </button>
        {state === "error" && <p role="alert" className="mt-3 text-sm text-red-700">Não foi possível enviar. Tente de novo ou chame no WhatsApp.</p>}
      </div>
    </form>
  );
}
