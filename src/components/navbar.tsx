import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useIdioma } from "@/idioma";
import Botao from "./botao";
import SeletorIdioma from "./seletor-idioma";

/**
 * Links do menu fora da página inicial: as âncoras voltam para "/#secao" e,
 * na página da loja, "Loja" aponta para ela mesma e fica marcado.
 */
export type Pagina = "inicio" | "loja" | "produto";

export function linkMenu(href: string, pagina: Pagina) {
  if (pagina === "inicio") return href;
  return href === "#loja" ? "/loja" : `/${href}`;
}

export const MENU = [
  { href: "#servicos", pt: "Serviços", en: "Services" },
  { href: "#loja", pt: "Loja", en: "Shop" },
  { href: "#previsao", pt: "Vento", en: "Wind" },
  { href: "#sobre", pt: "Sobre", en: "About" },
  { href: "#precos", pt: "Preços", en: "Prices" },
  { href: "#localizacao", pt: "Onde estamos", en: "Location" },
];

/**
 * Barra da North: logo à esquerda, links no centro, idioma e reserva à
 * direita, de borda a borda. Na página inicial começa transparente sobre o
 * vídeo e escurece quando a página rola; nas outras páginas já nasce escura.
 */
export default function Navbar({ pagina = "inicio" }: { pagina?: Pagina }) {
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

  const solida = rolou || aberto || pagina !== "inicio";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 text-white transition-colors duration-300 ${
        solida ? "border-b border-white/10 bg-abismo/90 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <a href={pagina === "inicio" ? "#inicio" : "/"} className="flex shrink-0 items-center gap-2.5">
          <img src="/logo-ts.png" alt="" width={34} height={34} className="h-[34px] w-[34px] rounded-full" />
          <span className="text-[17px] font-semibold tracking-[-0.03em]">TS Kite Center</span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex xl:gap-9" aria-label={t("Principal", "Main")}>
          {MENU.map((l) => (
            <a
              key={l.href}
              href={linkMenu(l.href, pagina)}
              aria-current={pagina !== "inicio" && l.href === "#loja" ? "page" : undefined}
              className="text-[15px] text-white/75 transition-colors hover:text-white aria-[current=page]:text-white aria-[current=page]:underline aria-[current=page]:decoration-sol aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-[10px]"
            >
              {t(l.pt, l.en)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SeletorIdioma claro={false} />
          <a
            href={linkMenu("#reservar", pagina)}
            className="hidden h-10 items-center rounded-full bg-sol px-5 text-[14px] font-semibold text-mar transition-colors hover:bg-[#EDD35B] sm:flex"
          >
            {t("Reservar aula", "Book a lesson")}
          </a>
          <button
            type="button"
            aria-label={aberto ? t("Fechar menu", "Close menu") : t("Abrir menu", "Open menu")}
            aria-expanded={aberto}
            aria-controls="menu-celular"
            onClick={() => setAberto(!aberto)}
            className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
          >
            {aberto ? (
              <X aria-hidden className="h-6 w-6" />
            ) : (
              <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden>
                <path d="M0 1H22M0 11H22" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu do celular: lista grande com linhas finas, como a gaveta da North */}
      <div id="menu-celular" hidden={!aberto} className="border-t border-white/10 lg:hidden">
        <nav className="shell pb-6 pt-2" aria-label={t("Principal", "Main")}>
          <ul className="divide-y divide-white/10">
            {MENU.map((l) => (
              <li key={l.href}>
                <a href={linkMenu(l.href, pagina)} onClick={() => setAberto(false)} className="block py-4 text-xl font-medium tracking-[-0.02em]">
                  {t(l.pt, l.en)}
                </a>
              </li>
            ))}
          </ul>
          <Botao href={linkMenu("#reservar", pagina)} className="mt-4 w-full">
            {t("Reservar aula", "Book a lesson")}
          </Botao>
        </nav>
      </div>
    </header>
  );
}
