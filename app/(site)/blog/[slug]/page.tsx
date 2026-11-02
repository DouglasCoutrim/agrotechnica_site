import { notFound } from "next/navigation";
import { Photo } from "@/components/ui/Photo";
import { fmtLong } from "@/components/site/Cards";
import { getPost } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P) {
  const { slug } = await params;
  const p = await getPost(slug);
  return p ? pageMeta(p.title, p.excerpt, `/blog/${slug}`) : {};
}

export default async function Page({ params }: P) {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) notFound();
  return (
    <article className="section-y">
      <div className="container-site max-w-3xl">
        <p className="font-mono text-sm text-forest-700">{[p.category, fmtLong(p.published_at)].filter(Boolean).join(" · ")}</p>
        <h1 className="mt-3">{p.title}</h1>
        <Photo src={p.image_url} placeholder="campo" alt={p.title} className="mt-10 aspect-[16/9] rounded-lg" priority />
        {/* Conteúdo vem do admin (usuário autenticado). Texto simples: parágrafos separados por linha em branco. */}
        <div className="prose-site mt-10">{(p.body ?? "").split("\n\n").map((t, i) => <p key={i}>{t}</p>)}</div>
      </div>
    </article>
  );
}
