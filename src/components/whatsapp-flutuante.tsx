import { linkWhatsApp } from "@/marca";
import { IconeWhatsApp } from "./icones";

/** Botão redondo sempre visível, como no MG Aldeota. */
export default function WhatsAppFlutuante() {
  return (
    <a
      href={linkWhatsApp("Olá! Vim pelo site da TS Kite Center.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_16px_rgba(37,211,102,0.4)] transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
    >
      <IconeWhatsApp className="h-7 w-7" />
    </a>
  );
}
