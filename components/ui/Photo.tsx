import Image from "next/image";

/** Foto do admin ou, se ainda não houver, uma ilustração genérica nas cores da marca. */
export function Photo({ src, placeholder = "drone", alt, className = "", priority = false, sizes }:
  { src?: string | null; placeholder?: string; alt: string; className?: string; priority?: boolean; sizes?: string }) {
  const url = src || `/placeholders/${placeholder}.svg`;
  return (
    <div className={`relative overflow-hidden bg-forest-900 ${className}`}>
      <Image src={url} alt={alt} fill priority={priority} sizes={sizes ?? "(min-width:1024px) 50vw, 100vw"}
        unoptimized={url.endsWith(".svg")} className="object-cover" />
    </div>
  );
}
