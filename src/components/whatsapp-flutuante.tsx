import { useEffect, useState } from "react";
import { linkWhatsApp } from "@/marca";
import { IconeWhatsApp } from "./icones";

/**
 * Botão redondo do WhatsApp. Só aparece depois que o hero sai de cena: no
 * topo ele cobria a faixa de vidro com o vento, e o hero já tem o botão de
 * reservar.
 */
export default function WhatsAppFlutuante() {
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const ver = () => setVisivel(window.scrollY > window.innerHeight * 0.6);
    ver();
    window.addEventListener("scroll", ver, { passive: true });
    return () => window.removeEventListener("scroll", ver);
  }, []);

  return (
    <a
      href={linkWhatsApp("Olá! Vim pelo site da TS Kite Center.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      tabIndex={visivel ? 0 : -1}
      className={`fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.4)] transition-all duration-500 hover:scale-105 sm:bottom-6 sm:right-6 ${
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <IconeWhatsApp className="h-7 w-7" />
    </a>
  );
}
