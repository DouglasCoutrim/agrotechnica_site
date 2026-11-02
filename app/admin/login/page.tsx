import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "./AuthForm";
import { login } from "../actions";
import { getSession } from "@/lib/auth";
import { q } from "@/lib/db";

export default async function Page() {
  if (await getSession()) redirect("/admin");
  let empty = false;
  try { const [{ n }] = await q<{ n: number }>("SELECT COUNT(*) n FROM users"); empty = n === 0; } catch { /* banco ainda não configurado */ }
  return (
    <main className="grid min-h-screen place-items-center bg-forest-950 p-5">
      <div className="w-full max-w-sm rounded-lg bg-paper p-8">
        <Image src="/brand/logo.jpg" alt="Agrotechnica" width={72} height={72} className="mb-4 mix-blend-multiply" />
        <h1 className="mb-6 !text-2xl">Painel da Agrotechnica</h1>
        <AuthForm action={login} mode="login" />
        {empty && <p className="mt-6 text-sm">Primeiro acesso? <Link href="/admin/setup" className="font-semibold text-forest-700 underline underline-offset-4">Criar administrador</Link></p>}
      </div>
    </main>
  );
}
