import { redirect } from "next/navigation";
import { AuthForm } from "../login/AuthForm";
import { setupAdmin } from "../actions";
import { q } from "@/lib/db";

export default async function Page() {
  const [{ n }] = await q<{ n: number }>("SELECT COUNT(*) n FROM users");
  if (n > 0) redirect("/admin/login");
  return (
    <main className="grid min-h-screen place-items-center bg-forest-950 p-5">
      <div className="w-full max-w-sm rounded-lg bg-paper p-8">
        <h1 className="mb-2 !text-2xl">Primeiro acesso</h1>
        <p className="mb-6 text-sm text-ink-muted">Crie o administrador. A chave de instalação é o valor de <code>SETUP_TOKEN</code> nas variáveis de ambiente.</p>
        <AuthForm action={setupAdmin} mode="setup" />
      </div>
    </main>
  );
}
