import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Idioma do site (português ou inglês), sem biblioteca.
 *
 * Ordem de escolha: ?lang=en|pt na URL, depois o que o visitante escolheu na
 * última visita, depois a língua do navegador (quem não usa português vê
 * inglês, pensando no turista que chega ao Cumbuco).
 *
 * Nos componentes: `const { t } = useIdioma()` e `t("Texto", "Text")`.
 */
export type Idioma = "pt" | "en";

const CHAVE = "ts:idioma";

export type Meta = Record<Idioma, { lang: string; titulo: string; descricao: string }>;

const META: Meta = {
  pt: {
    lang: "pt-BR",
    titulo: "TS Kite Center | Escola de kitesurf no Cumbuco",
    descricao:
      "Aprenda kitesurf com quem vive isso todos os dias. Aulas para todos os níveis, downwind, kite trip e wingfoil na Praia do Cumbuco (CE), dentro do Outro Beach Club. Mais de 2.000 alunos certificados.",
  },
  en: {
    lang: "en",
    titulo: "TS Kite Center | Kitesurf school in Cumbuco, Brazil",
    descricao:
      "Learn kitesurfing with locals who live it every day. Lessons for every level, downwind, kite trips and wingfoil at Cumbuco Beach (Ceará, Brazil), inside Outro Beach Club. Over 2,000 certified students.",
  },
};

function inicial(): Idioma {
  try {
    const url = new URLSearchParams(window.location.search).get("lang");
    if (url === "pt" || url === "en") return url;
    const salvo = localStorage.getItem(CHAVE);
    if (salvo === "pt" || salvo === "en") return salvo;
  } catch {
    // sem URL ou armazenamento: segue pela língua do navegador
  }
  return typeof navigator !== "undefined" && !navigator.language.toLowerCase().startsWith("pt") ? "en" : "pt";
}

type ValorContexto = {
  idioma: Idioma;
  setIdioma: (i: Idioma) => void;
  t: <T>(pt: T, en: T) => T;
};

const Contexto = createContext<ValorContexto | null>(null);

/** `meta` troca título e descrição numa página que não seja a inicial. */
export function ProvedorIdioma({ children, meta = META }: { children: ReactNode; meta?: Meta }) {
  const [idioma, setIdioma] = useState<Idioma>(inicial);

  useEffect(() => {
    const m = meta[idioma];
    document.documentElement.lang = m.lang;
    document.title = m.titulo;
    document.querySelector('meta[name="description"]')?.setAttribute("content", m.descricao);
    try {
      localStorage.setItem(CHAVE, idioma);
    } catch {
      // vale só nesta visita
    }
  }, [idioma, meta]);

  const t = <T,>(pt: T, en: T) => (idioma === "en" ? en : pt);
  return <Contexto.Provider value={{ idioma, setIdioma, t }}>{children}</Contexto.Provider>;
}

export function useIdioma() {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useIdioma precisa do ProvedorIdioma.");
  return valor;
}
