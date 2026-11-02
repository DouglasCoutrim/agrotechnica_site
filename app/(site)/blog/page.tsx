import { PageHero } from "@/components/site/PageHero";
import { PostCard } from "@/components/site/Cards";
import { getPosts } from "@/lib/queries";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("Blog: drones agrícolas, baterias e GPS", "Dicas de manutenção, cuidados com baterias e tecnologia no agro.", "/blog");

export default async function Page() {
  const posts = await getPosts();
  return (
    <>
      <PageHero kicker="Blog" title="Conteúdo técnico para quem opera drones no agro" />
      <section className="section-y">
        <div className="container-site">
          {posts.length ? <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <PostCard key={p.slug} p={p} />)}</div>
            : <p className="text-lg">Os primeiros artigos estão a caminho.</p>}
        </div>
      </section>
    </>
  );
}
