export function waLink(number: string, message: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

/** Procura mensagem exata ('/pecas') ou por prefixo ('/pecas/*'). */
export function messageFor(path: string, map: Record<string, string>) {
  if (map[path]) return map[path];
  const hit = Object.keys(map)
    .filter((k) => k.endsWith("/*") && path.startsWith(k.slice(0, -1)))
    .sort((a, b) => b.length - a.length)[0];
  return hit ? map[hit] : map["/"] ?? "Olá! Vim pelo site da Agrotechnica.";
}
