import { LinkButton } from "@/components/ui/Button";
export default function NotFound() {
  return (
    <section className="section-y"><div className="container-site max-w-xl">
      <h1>Página não encontrada</h1>
      <p className="mt-4 text-lg text-ink-muted">O endereço pode ter mudado. Volte ao início ou veja nossos serviços.</p>
      <div className="mt-8 flex gap-3"><LinkButton href="/">Ir para o início</LinkButton><LinkButton href="/servicos" variant="secondary">Ver serviços</LinkButton></div>
    </div></section>
  );
}
