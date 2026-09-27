import { linkWhatsApp } from "@/marca";
import VentoAgora from "./vento-agora";

/**
 * Linhas de vento de fundo. Cada uma é desenhada da direita para a esquerda
 * e a animação corre no sentido do traço, então o "sopro" vai para oeste,
 * como o vento de leste que sopra no Cumbuco.
 */
const LINHAS = [
  { y: 18, curva: -26, cor: "#E4C73D", dur: 7, atraso: 0 },
  { y: 30, curva: 18, cor: "#0FA3B8", dur: 9, atraso: -3 },
  { y: 44, curva: -14, cor: "#7EAE89", dur: 8, atraso: -5 },
  { y: 57, curva: 22, cor: "#0FA3B8", dur: 10, atraso: -1 },
  { y: 69, curva: -20, cor: "#E4C73D", dur: 8.5, atraso: -6 },
  { y: 82, curva: 12, cor: "#0FA3B8", dur: 11, atraso: -2 },
];

function LinhasDeVento() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
    >
      {LINHAS.map((l, i) => (
        <path
          key={i}
          d={`M1100 ${l.y} C 750 ${l.y + l.curva}, 350 ${l.y - l.curva}, -100 ${l.y}`}
          fill="none"
          stroke={l.cor}
          strokeOpacity={0.55}
          strokeWidth={1.4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="160 1240"
          className="linha-vento"
          style={{ animationDuration: `${l.dur}s`, animationDelay: `${l.atraso}s` }}
        />
      ))}
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="topo" className="relative isolate flex min-h-[100svh] overflow-hidden bg-mar text-white">
      {/* Luz: sol no alto à esquerda, água embaixo à direita, as duas pontas da logo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 8% 0%, rgba(228,199,61,0.22), transparent 70%), radial-gradient(60% 60% at 100% 100%, rgba(15,163,184,0.28), transparent 70%)",
        }}
      />
      <LinhasDeVento />

      <div className="mx-auto flex w-full max-w-7xl flex-col justify-end gap-10 px-4 pb-10 pt-28 sm:px-8 sm:pb-14 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="rotulo entrar text-sol">Escola de kitesurf · Cumbuco, Ceará</p>
          <h1
            className="titulo entrar mt-5 text-[2.6rem] sm:text-6xl lg:text-[5.4rem]"
            style={{ animationDelay: "0.1s" }}
          >
            Aprenda kite onde o <span className="texto-marca pr-2">vento</span> não falta.
          </h1>
          <p
            className="entrar mt-6 max-w-xl text-base leading-relaxed text-bruma sm:text-lg"
            style={{ animationDelay: "0.25s" }}
          >
            Instrutor do seu lado desde o primeiro contato com a pipa até o dia em que você entra e sai
            da água sozinho.
          </p>
          <div className="entrar mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.4s" }}>
            <a
              href={linkWhatsApp("Olá! Quero agendar uma aula de kitesurf.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-sol px-6 py-3.5 font-bold text-mar transition-transform hover:-translate-y-0.5"
            >
              Agendar aula
            </a>
            <a
              href="#aulas"
              className="rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white transition-colors hover:border-white/60"
            >
              Conhecer as aulas
            </a>
          </div>
        </div>

        <div className="entrar" style={{ animationDelay: "0.55s" }}>
          <VentoAgora />
        </div>
      </div>
    </section>
  );
}
