import { Star } from "lucide-react";
import { linkWhatsApp } from "@/marca";
import Botao from "./botao";
import Foto from "./foto";
import VentoAgora from "./vento-agora";

/**
 * Hero da referência: painel arredondado com margem, foto de céu em tela
 * cheia, título centralizado com a segunda metade apagada e uma faixa de
 * vidro na base.
 *
 * FALTA: foto ou vídeo real. O céu azul do placeholder é a cor de reserva e
 * mantém a primeira dobra clara enquanto a foto não chega.
 */
export default function Hero() {
  return (
    <section id="inicio" className="p-2 sm:p-3">
      <div className="relative isolate flex min-h-[640px] flex-col overflow-hidden rounded-painel h-[calc(100svh-16px)] sm:h-[calc(100svh-24px)]">
        <div className="absolute inset-0 -z-10">
          <Foto tom="ceu" aviso="nenhum" descricao="Kiter no ar no Cumbuco, com céu azul ao fundo" />
        </div>
        {/* Sombra suave no topo para o texto branco ler bem sobre qualquer foto */}
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-2/3 bg-[linear-gradient(180deg,rgba(6,34,43,0.35)_0%,rgba(6,34,43,0)_100%)]" />

        <div className="shell flex flex-1 flex-col items-center pt-32 text-center text-white sm:pt-40">
          <h1 className="titulo entrar max-w-4xl text-[2.5rem] sm:text-6xl lg:text-[4.1rem]">
            Aprenda kitesurf com quem vive isso <span className="suave">todos os dias</span>
          </h1>
          <p className="entrar mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg" style={{ animationDelay: "0.12s" }}>
            Set e Tomás nasceram no Cumbuco e já formaram mais de 2.000 alunos. Aulas para todos os níveis,
            downwind, kite trip e foil.
          </p>
          <div className="entrar mt-8" style={{ animationDelay: "0.24s" }}>
            <Botao href={linkWhatsApp("Olá! Vim pelo site e quero reservar uma aula de kite.")} externo>
              Reservar aula
            </Botao>
          </div>
        </div>

        {/* Faixa de vidro: prova, vento ao vivo e parceiros */}
        <div className="m-2 flex flex-col gap-4 rounded-3xl border border-white/25 bg-white/15 p-4 backdrop-blur-md sm:m-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
            <div className="rounded-2xl bg-white/15 px-4 py-3 text-white">
              <p className="text-sm text-white/85">5/5 no TripAdvisor</p>
              <p className="mt-1 flex gap-0.5" aria-label="5 estrelas">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} aria-hidden className="h-3.5 w-3.5 fill-sol text-sol" />
                ))}
              </p>
            </div>
            <VentoAgora />
          </div>
          <ul className="hidden items-center gap-8 text-white/85 lg:flex">
            {["Outro Beach Club", "North Kiteboarding", "2.000+ alunos"].map((p) => (
              <li key={p} className="text-[15px] font-medium tracking-[-0.02em]">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
