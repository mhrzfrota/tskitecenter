import { linkWhatsApp } from "@/marca";
import Botao from "./botao";
import { useIdioma } from "@/idioma";
import Foto from "./foto";

const BUSCA_MAPA = encodeURIComponent("Outro Beach Club, Av. Des. Jurema, 56, Cumbuco, Caucaia - CE");

/** Painel de chamada da referência: foto de fundo arredondada, texto à esquerda e um card flutuando à direita. */
export default function Localizacao() {
  const { idioma, t } = useIdioma();
  return (
    <section id="localizacao" className="p-2 sm:p-3">
      <div className="relative isolate overflow-hidden rounded-painel">
        <div className="absolute inset-0 -z-10">
          <Foto tom="ceu" aviso="nenhum" descricao={t("Outro Beach Club visto da praia", "Outro Beach Club seen from the beach")} />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(6,34,43,0.45)_0%,rgba(6,34,43,0.1)_60%)]" />

        <div className="shell grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="text-white">
            <p className="rotulo">{t("Onde estamos", "Where we are")}</p>
            <h2 className="titulo mt-5 text-[2.1rem] sm:text-5xl">
              {t("No Outro Beach Club,", "At Outro Beach Club,")} <span className="suave">{t("na beira da praia", "right on the beach")}</span>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/90">
              {t(
                "Gramado para montar o kite, estacionamento, chuveiros e espaço para a família passar o dia. Av. Des. Jurema, 56, Praia do Cumbuco, Caucaia (CE).",
                "A lawn to rig your kite, parking, showers and space for the whole family to spend the day. Av. Des. Jurema, 56, Cumbuco Beach, Caucaia, Ceará, Brazil.",
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Botao href={`https://www.google.com/maps?q=${BUSCA_MAPA}`} externo>
                {t("Abrir no mapa", "Open in Maps")}
              </Botao>
              <a
                href={linkWhatsApp(t("Olá! Vim pelo site da TS Kite Center.", "Hi! I found TS Kite Center through the website."))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-full bg-white/20 px-5 font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-white backdrop-blur-md transition-colors hover:bg-white/30"
              >
                {t("Falar com a equipe", "Talk to the team")}
              </a>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-2 shadow-[0_30px_60px_-24px_rgba(6,34,43,0.5)] sm:p-3">
            <iframe
              src={`https://www.google.com/maps?q=${BUSCA_MAPA}&hl=${idioma}&output=embed`}
              title={t("Mapa: TS Kite Center no Outro Beach Club", "Map: TS Kite Center at Outro Beach Club")}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full rounded-2xl border-0 bg-bandeja"
            />
            <div className="flex items-center justify-between px-3 pb-2 pt-4">
              <div>
                <p className="font-medium tracking-[-0.02em]">TS Kite Center</p>
                <p className="text-sm text-maré">{t("Cumbuco, Caucaia (CE)", "Cumbuco, Ceará, Brazil")}</p>
              </div>
              <span className="rounded-full bg-bandeja px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em]">Jul–Jan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
