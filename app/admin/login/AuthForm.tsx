"use client";
import { useActionState } from "react";

const inp = "w-full rounded-md border border-forest-900/25 bg-white px-3 py-2.5 focus:border-gold-500 focus:outline-none";
type Act = (prev: { error?: string } | undefined, fd: FormData) => Promise<{ error?: string } | undefined>;

export function AuthForm({ action, mode }: { action: Act; mode: "login" | "setup" }) {
  const [state, run, pending] = useActionState(action, undefined);
  return (
    <form action={run} className="space-y-5">
      {mode === "setup" && <>
        <label className="block"><span className="mb-1 block text-sm font-semibold">Chave de instalação</span><input name="token" type="password" required className={inp} /></label>
        <label className="block"><span className="mb-1 block text-sm font-semibold">Seu nome</span><input name="name" className={inp} /></label>
      </>}
      <label className="block"><span className="mb-1 block text-sm font-semibold">E-mail</span><input name="email" type="email" required autoComplete="username" className={inp} /></label>
      <label className="block"><span className="mb-1 block text-sm font-semibold">Senha</span><input name="password" type="password" required minLength={mode === "setup" ? 10 : undefined} autoComplete={mode === "setup" ? "new-password" : "current-password"} className={inp} /></label>
      {state?.error && <p role="alert" className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-md bg-forest-900 px-6 py-3 font-semibold text-paper hover:bg-forest-700 disabled:opacity-60">
        {pending ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar administrador"}
      </button>
    </form>
  );
}
