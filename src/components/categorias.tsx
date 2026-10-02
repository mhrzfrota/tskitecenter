import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, GraduationCap, Map, Sailboat, ShoppingBag, Wind } from "lucide-react";
import { linkWhatsApp } from "@/marca";
import { useIdioma } from "@/idioma";
import Cabecalho from "./cabecalho";
import Foto from "./foto";

type Categoria = {
  icone: LucideIcon;
  nome: string;
  texto: string;
  foto: string;
  src?: string;
  botao: string;
  href: string;
  externo?: boolean;
};

/**
 * As frentes do site em cards de foto inteira. No tablet e no desktop, duas
 * fileiras quase de borda a borda (2 em cima, 3 embaixo); o card sob o mouse
 * cresce e empurra os vizinhos. No celular, carrossel com indicador. Os cards
 * entram em cascata quando a seção aparece. A previsão não entra aqui: tem seção própria. Quando existirem páginas
 * próprias (loja, previsão), o link muda aqui.
 */
const CATEGORIAS = (t: <T>(pt: T, en: T) => T): Categoria[] => [
  {
    icone: GraduationCap,
    nome: t("Aulas de kitesurf", "Kitesurf lessons"),
    texto: t(
      "Do primeiro velejo ao avançado. A gente avalia você antes e monta o plano. Iniciante faz o curso de 10h.",
      "From your first ride to advanced. We assess you first and build the plan. Beginners take the 10-hour course.",
    ),
    foto: t("Instrutor e aluno com o kite na areia", "Instructor and student with the kite on the sand"),
    botao: t("Reservar aula", "Book a lesson"),
    href: "#reservar",
  },
  {
    icone: Wind,
    nome: "Downwind",
    texto: t(
      "Lagoinha → Guajiru e Pecém → Taíba, com 4x4 de apoio, resgate e suporte na água e em terra.",
      "Lagoinha → Guajiru and Pecém → Taíba, with a 4x4 support car, rescue and backup on the water and on land.",
    ),
    foto: t("Kiters velejando juntos no mar aberto", "Kiters riding together on the open sea"),
    botao: t("Saiba mais", "Learn more"),
    href: linkWhatsApp(t("Olá! Quero saber sobre o downwind.", "Hi! I'd like to know about the downwind.")),
    externo: true,
  },
  {
    icone: Map,
    nome: "Kite Trip",
    texto: t(
      "Circuito dos Ventos: viagem guiada pelo litoral cearense, velejando de spot em spot.",
      "Circuito dos Ventos: a guided trip along the Ceará coast, riding from spot to spot.",
    ),
    foto: t("Grupo da Kite Trip em uma praia do Ceará", "Kite Trip group on a beach in Ceará"),
    botao: t("Saiba mais", "Learn more"),
    href: linkWhatsApp(t("Olá! Quero saber sobre a Kite Trip, o Circuito dos Ventos.", "Hi! I'd like to know about the Kite Trip (Circuito dos Ventos).")),
    externo: true,
  },
  {
    icone: Sailboat,
    nome: t("Wingfoil e kite foil", "Wingfoil and kite foil"),
    texto: t(
      "Aulas personalizadas de controle da asa, equilíbrio e transições.",
      "Personalized lessons on wing control, balance and transitions.",
    ),
    foto: t("Aluno de wingfoil sobre a água", "Wingfoil student on the water"),
    botao: t("Saiba mais", "Learn more"),
    href: linkWhatsApp(t("Olá! Quero saber sobre as aulas de wingfoil e kite foil.", "Hi! I'd like to know about wingfoil and kite foil lessons.")),
    externo: true,
  },
  {
    icone: ShoppingBag,
    nome: "TS Kite Shop",
    texto: t(
      "Kites, pranchas e acessórios com a parceria North Kiteboarding, e quem entende para indicar.",
      "Kites, boards and accessories through our North Kiteboarding partnership, with experts to advise you.",
    ),
    foto: t("Vitrine da loja com kites e pranchas", "Shop display with kites and boards"),
    botao: t("Ver produtos", "See products"),
    href: "#loja",
  },
];

type Revelar = { visivel: boolean; atraso: number };

/**
 * Card de foto inteira. O <li> é o item flexível (cresce no hover); o miolo
 * é que entra com a animação de revelar, para o atraso da cascata não pesar
 * no hover.
 */
function Card({ c, n, destaque, revelar, className = "" }: { c: Categoria; n: number; destaque?: boolean; revelar: Revelar; className?: string }) {
  const Icone = c.icone;
  return (
    <li className={`group relative ${className}`}>
      <div
        className={`absolute inset-0 isolate flex flex-col justify-end overflow-hidden rounded-[28px] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none ${
          revelar.visivel ? "translate-y-0 scale-100 opacity-100" : "translate-y-10 scale-[0.97] opacity-0"
        }`}
        style={{ transitionDelay: revelar.visivel ? `${revelar.atraso}ms` : "0ms" }}
      >
        {/* Foto ocupando o card inteiro, com zoom lento no hover */}
        <div className="absolute inset-0 -z-10 transition-transform duration-[1400ms] ease-out group-hover:scale-[1.08] motion-reduce:transition-none">
          <Foto tom="ceu" aviso="topo" descricao={c.foto} src={c.src} />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,34,43,0.15)_0%,rgba(6,34,43,0)_25%,rgba(6,34,43,0.55)_58%,rgba(6,34,43,0.92)_100%)] transition-opacity duration-700"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-mar/0 transition-colors duration-700 group-hover:bg-mar/15" />

        <div className="absolute inset-x-5 top-5 flex items-center justify-between sm:inset-x-6 sm:top-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sol transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
            <Icone aria-hidden className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1 font-mono text-[11px] tracking-[0.12em] text-white backdrop-blur-md">
            {String(n).padStart(2, "0")}
          </span>
        </div>

        {/* Largura fixa no texto: o card cresce no hover sem o parágrafo pular de linha */}
        <div className="flex flex-col items-start p-5 text-white sm:p-7">
          <h3 className={`titulo ${destaque ? "text-[2rem] sm:text-[2.6rem]" : "text-[1.8rem] sm:text-[2rem]"}`}>{c.nome}</h3>
          <p className={`mt-2 leading-relaxed text-white/85 ${destaque ? "max-w-[30rem] text-[15px] sm:text-base" : "max-w-[22rem] text-[15px]"}`}>{c.texto}</p>
          <a
            href={c.href}
            {...(c.externo && { target: "_blank", rel: "noopener noreferrer" })}
            className="mt-6 inline-flex h-11 items-center gap-3 rounded-full bg-white pl-5 pr-1.5 font-mono text-[12px] font-medium uppercase tracking-[0.12em] text-mar transition-colors duration-300 hover:bg-sol"
          >
            {c.botao}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mar text-white transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight aria-hidden className="h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </li>
  );
}

/** Revela quando a seção entra na tela (uma vez). Sem IntersectionObserver, mostra direto. */
function useRevelar<T extends Element>() {
  const ref = useRef<T>(null);
  const [visivel, setVisivel] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return setVisivel(true);
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visivel };
}

// Duas fileiras: aulas (o carro-chefe) e downwind em cima; o resto embaixo
const FILEIRAS = [
  { itens: [0, 1], altura: "h-[560px]" },
  { itens: [2, 3, 4], altura: "h-[480px]" },
];

export default function Categorias() {
  const { t } = useIdioma();
  const lista = CATEGORIAS(t);
  const desktop = useRevelar<HTMLDivElement>();
  const celular = useRevelar<HTMLUListElement>();
  const trilho = celular.ref;
  const [atual, setAtual] = useState(0);

  // Indicador do carrossel: qual card está mais à esquerda
  function aoRolar() {
    const el = trilho.current;
    const primeiro = el?.firstElementChild as HTMLElement | null;
    if (!el || !primeiro) return;
    setAtual(Math.min(lista.length - 1, Math.round(el.scrollLeft / (primeiro.offsetWidth + 8))));
  }

  function irPara(i: number) {
    const el = trilho.current;
    const alvo = el?.children[i] as HTMLElement | undefined;
    if (el && alvo) el.scrollTo({ left: alvo.offsetLeft - el.offsetLeft - 20, behavior: "smooth" });
  }

  return (
    <section id="servicos" className="py-16 sm:py-24">
      <div className="shell">
        <Cabecalho
          rotulo={t("Serviços", "Services")}
          apoio={t("Escola, viagem, foil e loja no mesmo lugar, na Praia do Cumbuco.", "School, trips, foil and shop in one place, on Cumbuco Beach.")}
        >
          {t("Tudo o que a TS oferece", "Everything TS offers")} <span className="suave">{t("dentro e fora da água", "on and off the water")}</span>
        </Cabecalho>
      </div>

      {/* Tablet e desktop: duas fileiras quase de borda a borda; o card sob o mouse se expande */}
      <div ref={desktop.ref} className="mx-auto mt-14 hidden max-w-[1440px] flex-col gap-3 px-3 md:flex">
        {FILEIRAS.map((f, fi) => (
          <ul key={fi} className={`flex gap-3 ${f.altura}`}>
            {f.itens.map((i, k) => (
              <Card
                key={lista[i].nome}
                c={lista[i]}
                n={i + 1}
                destaque={i === 0}
                revelar={{ visivel: desktop.visivel, atraso: (fi * 2 + k) * 110 }}
                className={`min-w-0 basis-0 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] hover:grow-[1.9] motion-reduce:transition-none ${
                  i === 0 ? "grow-[1.4]" : "grow"
                }`}
              />
            ))}
          </ul>
        ))}
      </div>

      {/* Celular: carrossel com cards grandes e indicador */}
      <div className="mt-12 md:hidden">
        <ul
          ref={celular.ref}
          onScroll={aoRolar}
          className="flex snap-x snap-mandatory scroll-px-5 gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {lista.map((c, i) => (
            <Card
              key={c.nome}
              c={c}
              n={i + 1}
              revelar={{ visivel: celular.visivel, atraso: i * 110 }}
              className="h-[540px] w-[86%] shrink-0 snap-start"
            />
          ))}
        </ul>
        <div className="mt-5 flex justify-center gap-1.5" role="group" aria-label={t("Escolher serviço", "Choose a service")}>
          {lista.map((c, i) => (
            <button
              key={c.nome}
              type="button"
              aria-label={c.nome}
              aria-current={atual === i}
              onClick={() => irPara(i)}
              className="flex h-6 items-center"
            >
              <span className={`block h-1.5 rounded-full transition-all duration-500 ${atual === i ? "w-7 bg-mar" : "w-1.5 bg-mar/20"}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
