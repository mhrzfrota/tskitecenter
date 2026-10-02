import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useIdioma } from "@/idioma";
import Botao from "./botao";
import SeletorIdioma from "./seletor-idioma";

/**
 * Links do menu fora da página inicial: as âncoras voltam para "/#secao" e,
 * na página da loja, "Loja" aponta para ela mesma e fica marcado.
 */
export function linkMenu(href: string, pagina: "inicio" | "loja") {
  if (pagina === "inicio") return href;
  return href === "#loja" ? "/loja" : `/${href}`;
}

export const MENU = [
  { href: "#servicos", pt: "Serviços", en: "Services" },
  { href: "#precos", pt: "Preços", en: "Prices" },
  { href: "#previsao", pt: "Vento", en: "Wind" },
  { href: "#loja", pt: "Loja", en: "Shop" },
  { href: "#sobre", pt: "Sobre", en: "About" },
  { href: "#localizacao", pt: "Onde estamos", en: "Location" },
];

/**
 * Header da referência: logo à esquerda, links em mono no centro, pílula de
 * ação à direita. Começa transparente sobre o céu do hero e vira uma barra
 * branca arredondada quando a página rola.
 */
export default function Navbar({ pagina = "inicio" }: { pagina?: "inicio" | "loja" }) {
  const { t } = useIdioma();
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const ver = () => setRolou(window.scrollY > 40);
    ver();
    window.addEventListener("scroll", ver, { passive: true });
    return () => window.removeEventListener("scroll", ver);
  }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const claro = rolou || aberto;

  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 sm:top-4 sm:px-4">
      <div
        className={`mx-auto flex h-16 max-w-[1400px] items-center justify-between rounded-2xl px-4 transition-all duration-300 sm:px-6 lg:px-10 ${
          claro ? "bg-white/90 text-mar shadow-[0_10px_30px_-12px_rgba(6,34,43,0.25)] backdrop-blur-md" : "text-white"
        }`}
      >
        <a href={pagina === "inicio" ? "#inicio" : "/"} className="flex items-center gap-2.5">
          <img src="/logo-ts.png" alt="" width={36} height={36} className="h-9 w-9 rounded-full" />
          <span className="text-lg font-medium tracking-[-0.04em]">TS Kite Center</span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label={t("Principal", "Main")}>
          {MENU.map((l) => (
            <a
              key={l.href}
              href={linkMenu(l.href, pagina)}
              aria-current={pagina === "loja" && l.href === "#loja" ? "page" : undefined}
              className="font-mono text-[13px] uppercase tracking-[0.12em] opacity-90 transition-opacity hover:opacity-100 aria-[current=page]:underline aria-[current=page]:decoration-sol aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"
            >
              {t(l.pt, l.en)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SeletorIdioma claro={claro} />
          <a
            href={linkMenu("#reservar", pagina)}
            className="hidden h-10 items-center rounded-full bg-sol px-5 font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-mar sm:flex"
          >
            {t("Reservar aula", "Book a lesson")}
          </a>
          <button
            type="button"
            aria-label={aberto ? t("Fechar menu", "Close menu") : t("Abrir menu", "Open menu")}
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto(!aberto)}
            className="flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
          >
            {aberto ? (
              <X aria-hidden className="h-6 w-6" />
            ) : (
              <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden>
                <path d="M0 1H22M0 7H22M0 13H22" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu do celular: painel branco arredondado logo abaixo da barra */}
      <div
        id="menu-celular"
        hidden={!aberto}
        className="mx-auto mt-2 max-w-[1400px] rounded-2xl bg-white p-3 text-mar shadow-[0_20px_40px_-16px_rgba(6,34,43,0.3)] lg:hidden"
      >
        {MENU.map((l) => (
          <a
            key={l.href}
            href={linkMenu(l.href, pagina)}
            onClick={() => setAberto(false)}
            className="block rounded-xl px-4 py-3.5 font-mono text-sm uppercase tracking-[0.12em] hover:bg-bandeja"
          >
            {t(l.pt, l.en)}
          </a>
        ))}
        <Botao href={linkMenu("#reservar", pagina)} className="mt-2 w-full justify-between">
          {t("Reservar aula", "Book a lesson")}
        </Botao>
      </div>
    </header>
  );
}
