import { useEffect, useRef } from "react";
import { Star } from "lucide-react";
import { useIdioma } from "@/idioma";
import Botao from "./botao";
import VentoAgora from "./vento-agora";

/**
 * Hero no formato da North: vídeo de borda a borda, título grande ancorado
 * embaixo à esquerda e, no pé, uma linha fina com a prova, o vento ao vivo e
 * os parceiros, sem caixa em volta.
 *
 * Vídeo: original videots.mov (4K HEVC 60fps) convertido para H.264 30fps sem
 * áudio em public/video: 1080p deitado e um recorte em pé do centro
 * (1080x1920) para telas em pé, com o mesmo enquadramento que o object-cover
 * daria. Quem pede menos movimento fica no primeiro quadro.
 */
export default function Hero() {
  const { t } = useIdioma();
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.current?.pause();
  }, []);

  return (
    <section id="inicio" className="relative isolate flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-oceano text-white">
      <video
        ref={video}
        aria-hidden
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        poster="/video/ts-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/video/ts-vertical.mp4" type="video/mp4" media="(orientation: portrait)" />
        <source src="/video/ts-1080.mp4" type="video/mp4" />
      </video>
      {/* Véu escuro por igual (o céu do pôr do sol é claro) e sombras: no topo para o menu, embaixo e à esquerda para o texto */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/40" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_22%,rgba(0,0,0,0)_42%,rgba(0,0,0,0.85)_100%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_70%)]" />

      <div className="shell flex flex-1 flex-col justify-end pb-10 [text-shadow:0_2px_4px_rgba(0,0,0,0.35),0_4px_32px_rgba(0,0,0,0.6)] sm:pb-14">
        <p className="rotulo entrar">{t("Praia do Cumbuco, Ceará", "Cumbuco Beach, Brazil")}</p>
        {/* Uma ideia por linha a partir do tablet; no celular o texto corre livre */}
        <h1 className="titulo entrar mt-5 text-[2.75rem] sm:text-7xl lg:text-[5.6rem]" style={{ animationDelay: "0.08s" }}>
          <span className="sm:block">{t("Aprenda kitesurf", "Learn kitesurfing")}</span>{" "}
          <span className="sm:block">{t("com quem vive isso", "with locals who live it")}</span>{" "}
          <span className="font-normal opacity-90 sm:block">{t("todos os dias", "every day")}</span>
        </h1>
        <div className="entrar mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between" style={{ animationDelay: "0.18s" }}>
          <p className="max-w-md text-base font-medium leading-relaxed text-white sm:text-lg">
            {t(
              "Set e Tomás nasceram no Cumbuco e já formaram mais de 2.000 alunos. Aulas para todos os níveis, downwind, kite trip e foil.",
              "Set and Tomás were born in Cumbuco and have trained over 2,000 students. Lessons for every level, downwind, kite trips and foil.",
            )}
          </p>
          <div className="flex flex-wrap gap-3 [text-shadow:none]">
            <Botao href="#reservar">{t("Reservar aula", "Book a lesson")}</Botao>
            <Botao href="#precos" variante="vidro">
              {t("Ver preços", "See prices")}
            </Botao>
          </div>
        </div>
      </div>

      {/* Pé do hero: prova, vento ao vivo e parceiros numa linha fina */}
      <div className="border-t border-white/15 bg-black/30 backdrop-blur-sm">
        <div className="shell flex flex-wrap items-center gap-x-10 gap-y-4 py-4 sm:py-5">
          <div className="flex items-center gap-3">
            <p className="flex gap-0.5" aria-label={t("5 estrelas", "5 stars")}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} aria-hidden className="h-3.5 w-3.5 fill-sol text-sol" />
              ))}
            </p>
            <p className="text-sm font-medium">{t("5/5 no TripAdvisor", "5/5 on TripAdvisor")}</p>
          </div>
          <span aria-hidden className="hidden h-8 w-px bg-white/15 sm:block" />
          <VentoAgora />
          <ul className="ml-auto hidden items-center gap-8 text-sm text-white/85 xl:flex">
            {["Outro Beach Club", "North Kiteboarding", t("Certificação IKO", "IKO certification")].map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
