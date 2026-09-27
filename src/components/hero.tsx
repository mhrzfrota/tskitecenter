import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { linkWhatsApp } from "@/marca";
import Foto from "./foto";

type Slide = {
  eyebrow: string;
  titulo: string;
  texto: string;
  foto: string;
  src?: string;
  cta: { rotulo: string; href: string; externo?: boolean };
};

const SLIDES: Slide[] = [
  {
    eyebrow: "Escola de kitesurf · Cumbuco",
    titulo: "Aprenda kitesurf com quem vive isso todos os dias",
    texto: "Set e Tomás nasceram no Cumbuco. Mais de 2.000 alunos certificados, do primeiro velejo ao avançado.",
    foto: "Aluno velejando com instrutor da TS na praia do Cumbuco",
    cta: { rotulo: "Reservar aula", href: linkWhatsApp("Olá! Vim pelo site e quero reservar uma aula de kite."), externo: true },
  },
  {
    eyebrow: "Downwind",
    titulo: "De Lagoinha a Guajiru, a favor do vento",
    texto: "Com 4x4 de apoio, resgate e suporte na água e em terra.",
    foto: "Grupo em downwind no litoral cearense",
    cta: { rotulo: "Quero fazer downwind", href: linkWhatsApp("Olá! Quero saber sobre o downwind."), externo: true },
  },
  {
    eyebrow: "TS Kite Shop",
    titulo: "Equipamento de ponta para a sua sessão",
    texto: "Kites, pranchas e acessórios com a parceria North Kiteboarding.",
    foto: "Equipamentos North na loja da TS",
    cta: { rotulo: "Ver a loja", href: "#loja" },
  },
];

const TEMPO = 6000;

/**
 * Slider no padrão MG Aldeota (foto em tela cheia, setas nas laterais,
 * pontos embaixo), mas claro: um véu branco do lado do texto no lugar do
 * escurecido, para a primeira dobra ficar leve e nas cores da TS.
 */
export default function Hero() {
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  const toque = useRef<number | null>(null);
  const semMovimento =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ir = (i: number) => setAtivo((i + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (pausado || semMovimento) return;
    const t = setTimeout(() => ir(ativo + 1), TEMPO);
    return () => clearTimeout(t);
  }, [ativo, pausado, semMovimento]);

  return (
    <section
      id="inicio"
      aria-roledescription="carrossel"
      aria-label="Destaques da TS Kite Center"
      className="relative mt-[72px] h-[calc(100svh-72px)] min-h-[560px] overflow-hidden bg-espuma"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") ir(ativo - 1);
        if (e.key === "ArrowRight") ir(ativo + 1);
      }}
      onTouchStart={(e) => (toque.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (toque.current === null) return;
        const d = e.changedTouches[0].clientX - toque.current;
        if (Math.abs(d) > 50) ir(d < 0 ? ativo + 1 : ativo - 1);
        toque.current = null;
      }}
    >
      <div
        className="flex h-full transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${ativo * 100}%)` }}
      >
        {SLIDES.map((s, i) => {
          const atual = i === ativo;
          const Titulo = i === 0 ? "h1" : "h2";
          return (
            <article
              key={s.titulo}
              aria-roledescription="slide"
              aria-label={`${i + 1} de ${SLIDES.length}`}
              aria-hidden={!atual}
              {...(!atual && { inert: "" })}
              className="relative h-full w-full shrink-0"
            >
              <div className="absolute inset-0">
                <Foto aviso="direita" descricao={s.foto} src={s.src} />
              </div>
              {/* Véu claro: embaixo no celular, à esquerda no desktop */}
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.88)_45%,rgba(255,255,255,0)_78%)] md:bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.8)_38%,rgba(255,255,255,0)_68%)]"
              />
              <div className="shell relative flex h-full items-end pb-20 md:items-center md:pb-0">
                <div key={atual ? "on" : "off"} className={`max-w-xl ${atual ? "" : "opacity-0"}`}>
                  <p className="eyebrow entrar text-lagoa-forte">{s.eyebrow}</p>
                  <Titulo
                    className="entrar mt-4 font-display text-[1.9rem] font-bold uppercase leading-[1.15] tracking-[0.1em] sm:text-[2.6rem] lg:text-[3.1rem]"
                    style={{ animationDelay: "0.1s" }}
                  >
                    {s.titulo}
                  </Titulo>
                  <p className="entrar mt-5 max-w-md text-base leading-relaxed tracking-normal text-maré" style={{ animationDelay: "0.2s" }}>
                    {s.texto}
                  </p>
                  <div className="entrar mt-8" style={{ animationDelay: "0.3s" }}>
                    <a
                      href={s.cta.href}
                      {...(s.cta.externo && { target: "_blank", rel: "noopener noreferrer" })}
                      className="btn-primario"
                    >
                      {s.cta.rotulo}
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Slide anterior"
        onClick={() => ir(ativo - 1)}
        className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-mar/20 bg-white/70 transition-colors hover:bg-white md:flex lg:left-6"
      >
        <ChevronLeft aria-hidden className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Próximo slide"
        onClick={() => ir(ativo + 1)}
        className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-mar/20 bg-white/70 transition-colors hover:bg-white md:flex lg:right-6"
      >
        <ChevronRight aria-hidden className="h-5 w-5" />
      </button>

      <div className="absolute inset-x-0 bottom-7 flex justify-center gap-3" role="group" aria-label="Escolher slide">
        {SLIDES.map((s, i) => (
          <button
            key={s.titulo}
            type="button"
            aria-label={`Slide ${i + 1}`}
            aria-current={i === ativo}
            onClick={() => ir(i)}
            className="flex h-6 w-6 items-center justify-center"
          >
            <span className={`block h-2.5 w-2.5 rounded-full transition-all ${i === ativo ? "scale-125 bg-lagoa-forte" : "bg-mar/25"}`} />
          </button>
        ))}
      </div>

      {/* Fio da marca na base do hero */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-marca" />
    </section>
  );
}
