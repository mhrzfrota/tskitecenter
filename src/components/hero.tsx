import { Star } from "lucide-react";
import { useIdioma } from "@/idioma";
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
  const { t } = useIdioma();
  return (
    <section id="inicio" className="p-2 sm:p-3">
      <div className="relative isolate flex min-h-[640px] flex-col overflow-hidden rounded-painel h-[calc(100svh-16px)] sm:h-[min(calc(100svh-24px),780px)]">
        <div className="absolute inset-0 -z-10">
          <Foto tom="ceu" aviso="nenhum" descricao={t("Kiter no ar no Cumbuco, com céu azul ao fundo", "Kiter in the air in Cumbuco, blue sky behind")} />
        </div>
        {/* Sombra suave no topo para o texto branco ler bem sobre qualquer foto */}
        <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-2/3 bg-[linear-gradient(180deg,rgba(6,34,43,0.35)_0%,rgba(6,34,43,0)_100%)]" />

        <div className="shell flex flex-1 flex-col items-center pt-32 text-center text-white sm:pt-40">
          <h1 className="titulo entrar max-w-4xl text-[2.5rem] sm:text-6xl lg:text-[4.1rem]">
            {t("Aprenda kitesurf com quem vive isso", "Learn kitesurfing with locals who live it")}{" "}
            <span className="suave">{t("todos os dias", "every day")}</span>
          </h1>
          <p className="entrar mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg" style={{ animationDelay: "0.12s" }}>
            {t(
              "Set e Tomás nasceram no Cumbuco e já formaram mais de 2.000 alunos. Aulas para todos os níveis, downwind, kite trip e foil.",
              "Set and Tomás were born in Cumbuco and have trained over 2,000 students. Lessons for every level, downwind, kite trips and foil.",
            )}
          </p>
          <div className="entrar mt-8" style={{ animationDelay: "0.24s" }}>
            <Botao href="#reservar">
              {t("Reservar aula", "Book a lesson")}
            </Botao>
          </div>
        </div>

        {/* Faixa de vidro: prova, vento ao vivo e parceiros */}
        <div className="m-2 flex flex-col gap-4 rounded-3xl border border-white/20 bg-mar/30 p-4 backdrop-blur-md sm:m-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-white">
              <p className="text-sm font-medium">{t("5/5 no TripAdvisor", "5/5 on TripAdvisor")}</p>
              <p className="mt-1 flex gap-0.5" aria-label={t("5 estrelas", "5 stars")}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} aria-hidden className="h-4 w-4 fill-sol text-sol" />
                ))}
              </p>
            </div>
            <VentoAgora />
          </div>
          <ul className="hidden items-center gap-8 text-white xl:flex">
            {["Outro Beach Club", "North Kiteboarding", t("Certificação IKO", "IKO certification")].map((p) => (
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
