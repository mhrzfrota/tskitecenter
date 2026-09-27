import { useEffect, useRef, useState } from "react";
import { MapPin, X } from "lucide-react";
import { linkWhatsApp } from "@/marca";
import { IconeWhatsApp } from "./icones";

export const MENU = [
  { href: "#inicio", rotulo: "Início" },
  { href: "#categorias", rotulo: "O que oferecemos" },
  { href: "#loja", rotulo: "Loja" },
  { href: "#vento", rotulo: "Vento agora" },
  { href: "#por-que", rotulo: "Por que a TS" },
  { href: "#localizacao", rotulo: "Localização" },
  { href: "#contato", rotulo: "Contato" },
];

/**
 * Header no padrão MG Aldeota: branco, logo no centro, atalhos à direita
 * (WhatsApp, localização e menu). O menu abre como painel lateral.
 */
export default function Navbar() {
  const [aberto, setAberto] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const painel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    if (aberto) painel.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && fechar();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [aberto]);

  function fechar() {
    setAberto(false);
    botaoMenu.current?.focus();
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 h-[72px] bg-white shadow-[0_1px_0_rgba(6,34,43,0.06)]">
        <div className="shell grid h-full grid-cols-[1fr_auto_1fr] items-center">
          <a href="#inicio" className="col-start-2 flex items-center gap-3">
            <img src="/logo-ts.png" alt="" width={44} height={44} className="h-11 w-11 rounded-full" />
            <span className="hidden text-[13px] uppercase tracking-[0.3em] sm:inline">
              <strong className="font-display font-extrabold italic tracking-[0.2em] text-lagoa-forte">TS</strong> Kite Center
            </span>
            <span className="sr-only sm:hidden">TS Kite Center</span>
          </a>

          <div className="col-start-3 flex items-center justify-end gap-1 sm:gap-2">
            <a
              href={linkWhatsApp("Olá! Vim pelo site da TS Kite Center.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hidden h-11 w-11 items-center justify-center transition-colors hover:text-lagoa-forte sm:flex"
            >
              <IconeWhatsApp />
            </a>
            <a href="#localizacao" aria-label="Localização" className="hidden h-11 w-11 items-center justify-center transition-colors hover:text-lagoa-forte sm:flex">
              <MapPin aria-hidden className="h-5 w-5" strokeWidth={1.75} />
            </a>
            <button
              ref={botaoMenu}
              type="button"
              aria-label="Abrir menu"
              aria-expanded={aberto}
              aria-controls="menu-site"
              onClick={() => setAberto(true)}
              className="flex h-11 w-11 items-center justify-center"
            >
              <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden>
                <path d="M0 1H24M0 9H24M0 17H24" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-site"
        role="dialog"
        aria-modal="true"
        aria-label="Menu do site"
        aria-hidden={!aberto}
        onClick={(e) => e.target === e.currentTarget && fechar()}
        className={`fixed inset-0 z-50 flex justify-end bg-mar/55 transition-opacity duration-300 ${
          aberto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          ref={painel}
          tabIndex={-1}
          className={`flex h-full w-full max-w-md flex-col bg-white px-8 pb-10 pt-6 outline-none transition-transform duration-300 ${
            aberto ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button type="button" onClick={fechar} aria-label="Fechar menu" className="-mr-2 flex h-11 w-11 items-center justify-center self-end">
            <X aria-hidden className="h-6 w-6" strokeWidth={1.5} />
          </button>
          <nav className="mt-8">
            {MENU.map((l) => (
              <a
                key={l.href}
                href={l.href}
                tabIndex={aberto ? 0 : -1}
                onClick={() => setAberto(false)}
                className="block border-b border-mar/10 py-4 text-sm uppercase tracking-[0.3em] transition-colors hover:text-lagoa-forte"
              >
                {l.rotulo}
              </a>
            ))}
          </nav>
          <a
            href={linkWhatsApp("Olá! Vim pelo site e quero reservar uma aula de kite.")}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={aberto ? 0 : -1}
            className="btn-primario mt-auto"
          >
            Reservar aula
          </a>
        </div>
      </div>
    </>
  );
}
