import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { useIdioma } from "@/idioma";
import Botao from "./botao";
import VentoAgora from "./vento-agora";

/**
 * Hero da referência: painel arredondado com margem, vídeo da escola em tela
 * cheia, título centralizado com a segunda metade apagada e uma faixa de
 * vidro na base.
 *
 * Vídeo: original 1008.mov (4K HEVC) convertido para H.264 sem áudio em
 * public/video: 1080p deitado e um recorte em pé do centro (1080x1920) para
 * telas em pé, com o mesmo enquadramento que o object-cover daria. Quem pede
 * menos movimento fica no primeiro quadro.
 */
export default function Hero() {
  const { t } = useIdioma();
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.current?.pause();
  }, []);

  return (
    <section id="inicio" className="p-2 sm:p-3">
      <div className="relative isolate flex min-h-[640px] flex-col overflow-hidden rounded-painel h-[calc(100svh-16px)] sm:h-[min(calc(100svh-24px),780px)]">
        <video
          ref={video}
          aria-hidden
          className="absolute inset-0 -z-10 h-full w-full bg-ceu object-cover"
          poster="/video/hero-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/video/hero-vertical.mp4" type="video/mp4" media="(orientation: portrait)" />
          <source src="/video/hero-1080.mp4" type="video/mp4" />
        </video>
        {/* Sombra geral e uma mancha mais escura atrás do texto: a areia clara do vídeo apagava o branco */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,34,43,0.6)_0%,rgba(6,34,43,0.4)_55%,rgba(6,34,43,0.15)_100%)]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_38%,rgba(6,34,43,0.5)_0%,rgba(6,34,43,0)_70%)]" />

        <div className="shell flex flex-1 flex-col items-center pt-32 text-center text-white [text-shadow:0_2px_20px_rgba(6,34,43,0.55)] sm:pt-40">
          <h1 className="titulo entrar max-w-4xl text-[2.5rem] sm:text-6xl lg:text-[4.1rem]">
            {t("Aprenda kitesurf com quem vive isso", "Learn kitesurfing with locals who live it")}{" "}
            <span className="opacity-75">{t("todos os dias", "every day")}</span>
          </h1>
          <p className="entrar mt-6 max-w-xl text-base font-medium leading-relaxed text-white sm:text-lg" style={{ animationDelay: "0.12s" }}>
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
