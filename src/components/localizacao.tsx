import { linkWhatsApp } from "@/marca";
import Botao from "./botao";
import { useIdioma } from "@/idioma";

const BUSCA_MAPA = encodeURIComponent("Outro Beach Club, Av. Des. Jurema, 56, Cumbuco, Caucaia - CE");

/**
 * Faixa dividida como a "Club North": o mapa ocupa metade de borda a borda e
 * o texto fica na outra metade, sobre o escuro. No celular, texto em cima e
 * mapa embaixo.
 */
export default function Localizacao() {
  const { idioma, t } = useIdioma();
  return (
    <section id="localizacao" className="escuro grid border-t border-white/10 lg:grid-cols-2">
      <div className="order-2 min-h-[360px] bg-mar-2 lg:order-1 lg:min-h-[600px]">
        <iframe
          src={`https://www.google.com/maps?q=${BUSCA_MAPA}&hl=${idioma}&output=embed`}
          title={t("Mapa: TS Kite Center no Outro Beach Club", "Map: TS Kite Center at Outro Beach Club")}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full min-h-[360px] w-full border-0"
        />
      </div>

      <div className="order-1 flex flex-col justify-center px-5 py-20 sm:px-8 lg:order-2 lg:px-16 lg:py-24 xl:px-24">
        <p className="rotulo">{t("Onde estamos", "Where we are")}</p>
        <h2 className="titulo mt-4 max-w-xl text-[2.25rem] sm:text-5xl lg:text-[3.6rem]">
          {t("No Outro Beach Club,", "At Outro Beach Club,")} <span className="suave">{t("na beira da praia", "right on the beach")}</span>
        </h2>
        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/70 sm:text-base">
          {t(
            "Gramado para montar o kite, estacionamento, chuveiros e espaço para a família passar o dia.",
            "A lawn to rig your kite, parking, showers and space for the whole family to spend the day.",
          )}
        </p>

        <dl className="mt-10 grid max-w-md grid-cols-2 border-t border-white/10 pt-6 text-sm">
          <div>
            <dt className="text-white/50">{t("Endereço", "Address")}</dt>
            <dd className="mt-1.5 leading-relaxed">
              Av. Des. Jurema, 56
              <br />
              {t("Praia do Cumbuco, Caucaia (CE)", "Cumbuco Beach, Ceará")}
            </dd>
          </div>
          <div className="border-l border-white/10 pl-6">
            <dt className="text-white/50">{t("Temporada", "Season")}</dt>
            <dd className="mt-1.5 leading-relaxed">{t("Vento forte de julho a janeiro", "Strong wind from July to January")}</dd>
          </div>
        </dl>

        <div className="mt-10 flex flex-wrap gap-3">
          <Botao href={`https://www.google.com/maps?q=${BUSCA_MAPA}`} externo>
            {t("Abrir no mapa", "Open in Maps")}
          </Botao>
          <Botao
            href={linkWhatsApp(t("Olá! Vim pelo site da TS Kite Center.", "Hi! I found TS Kite Center through the website."))}
            externo
            variante="vidro"
          >
            {t("Falar com a equipe", "Talk to the team")}
          </Botao>
        </div>
      </div>
    </section>
  );
}
