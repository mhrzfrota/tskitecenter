import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useIdioma, type Idioma } from "@/idioma";

/** Bandeiras em SVG: emoji de bandeira não aparece no Windows. */
function BandeiraBrasil() {
  return (
    <svg viewBox="0 0 28 20" aria-hidden className="h-full w-full">
      <rect width="28" height="20" fill="#009C3B" />
      <path d="M14 2.5 25.5 10 14 17.5 2.5 10z" fill="#FFDF00" />
      <circle cx="14" cy="10" r="4.6" fill="#002776" />
      <path d="M9.6 9.1c2.9-.5 6.1.1 8.7 1.8" stroke="#fff" strokeWidth="0.9" fill="none" />
    </svg>
  );
}

function BandeiraEUA() {
  return (
    <svg viewBox="0 0 28 20" aria-hidden className="h-full w-full">
      <rect width="28" height="20" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={(i * 20) / 13} width="28" height={20 / 13} fill="#B22234" />
      ))}
      <rect width="12" height={(20 / 13) * 7} fill="#3C3B6E" />
    </svg>
  );
}

const OPCOES: { id: Idioma; curto: string; nome: string; pais: string; Bandeira: () => JSX.Element }[] = [
  { id: "pt", curto: "PT", nome: "Português", pais: "Brasil", Bandeira: BandeiraBrasil },
  { id: "en", curto: "EN", nome: "English", pais: "United States", Bandeira: BandeiraEUA },
];

function Bandeira({ opcao }: { opcao: (typeof OPCOES)[number] }) {
  return (
    <span className="block h-[14px] w-5 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10">
      <opcao.Bandeira />
    </span>
  );
}

/**
 * Seletor de idioma da topbar: bandeira e sigla na barra, e a lista com
 * bandeira, idioma e país ao abrir. `claro` segue o estado da navbar
 * (transparente sobre o hero ou barra branca).
 */
export default function SeletorIdioma({ claro }: { claro: boolean }) {
  const { idioma, setIdioma, t } = useIdioma();
  const [aberto, setAberto] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);
  const atual = OPCOES.find((o) => o.id === idioma) ?? OPCOES[0];

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: PointerEvent) => !caixa.current?.contains(e.target as Node) && setAberto(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", fora);
      document.removeEventListener("keydown", esc);
    };
  }, [aberto]);

  return (
    <div ref={caixa} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-label={t(`Idioma: ${atual.nome}. Trocar idioma`, `Language: ${atual.nome}. Change language`)}
        onClick={() => setAberto(!aberto)}
        className={`flex h-10 items-center gap-2 rounded-full px-3 font-mono text-[13px] font-medium uppercase tracking-[0.12em] transition-colors ${
          claro ? "bg-bandeja hover:bg-pilula" : "bg-white/15 hover:bg-white/25"
        }`}
      >
        <Bandeira opcao={atual} />
        {atual.curto}
        <ChevronDown aria-hidden className={`h-3.5 w-3.5 transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>

      {aberto && (
        <ul
          role="listbox"
          aria-label={t("Escolha o idioma", "Choose language")}
          className="absolute right-0 top-12 z-50 w-56 rounded-2xl bg-white p-1.5 text-mar shadow-[0_20px_40px_-16px_rgba(6,34,43,0.35)] ring-1 ring-black/5"
        >
          {OPCOES.map((o) => (
            <li key={o.id} role="option" aria-selected={o.id === idioma}>
              <button
                type="button"
                onClick={() => {
                  setIdioma(o.id);
                  setAberto(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-bandeja"
              >
                <Bandeira opcao={o} />
                <span className="flex-1 leading-tight">
                  <span className="block text-[15px] font-medium">{o.nome}</span>
                  <span className="block text-xs text-maré">{o.pais}</span>
                </span>
                {o.id === idioma && <Check aria-hidden className="h-4 w-4 text-lagoa-forte" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
