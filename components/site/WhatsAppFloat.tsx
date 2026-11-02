"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { messageFor, waLink } from "@/lib/whatsapp";

export function WhatsAppFloat({ number, messages }: { number: string; messages: Record<string, string> }) {
  const path = usePathname();
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 2000); return () => clearTimeout(t); }, []);
  if (!show) return null;

  return (
    <a href={waLink(number, messageFor(path, messages))} target="_blank" rel="noopener noreferrer"
      aria-label="Falar com um especialista no WhatsApp"
      className="group fixed bottom-5 right-5 z-30 flex items-center gap-0 rounded-full bg-wa text-white shadow-lg transition-all pulse-wa hover:pr-5">
      <span className="grid h-14 w-14 place-items-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-1.9 1.3-.5.1-1.1.1-1.8-.1a14 14 0 0 1-5.3-3.9c-1.2-1.4-1.9-2.8-2-3.6-.1-.9.4-1.6.7-1.9.3-.3.6-.3.8-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.4.6c-.2.2-.3.4-.1.7.5.9 1.5 1.8 2.4 2.3.3.2.5.1.7-.1l.7-.9c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.4 0 .2 0 .8-.3 1.5Z" /></svg>
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-[12rem]">Fale com um especialista</span>
    </a>
  );
}
