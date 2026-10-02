import Botao from "./botao";
import Cabecalho from "./cabecalho";
import { useIdioma, type Idioma } from "@/idioma";

const SPOT = 68535; // Windguru: Brazil - Cumbuco

// Parâmetros do gerador de widget do Windguru: nós, °C, português, 5 dias
const BASE = ["wj=knots", "tj=c", "waj=m", "odh=0", "doh=24", "fhours=120", "hrsm=2", "vt=forecasts"];

/**
 * O widget aceita um modelo só: o WG (mistura do Windguru) não tem ondas,
 * então as ondas vêm do GFS-Wave numa segunda tabela.
 */
const TABELAS = [
  {
    modelo: 100,
    params: "RATING,WINDSPD,GUST,SMER,TMPE",
    titulo: { pt: "Vento no Cumbuco (Windguru)", en: "Wind in Cumbuco (Windguru)" },
    altura: "h-[222px]",
  },
  {
    modelo: 84,
    params: "HTSGW,PERPW,DIRPW",
    titulo: { pt: "Ondas no Cumbuco (Windguru, GFS-Wave)", en: "Waves in Cumbuco (Windguru, GFS-Wave)" },
    altura: "h-[156px]",
  },
];

/**
 * Iframe do widget oficial do Windguru, sem o script deles: o script ajusta a
 * altura por mensagem e aqui ela ficava em 0. Como cada tabela tem sempre as
 * mesmas linhas, a altura fixa resolve. No celular a tabela rola para o lado
 * dentro do próprio iframe; no desktop ganha um zoom leve para ler melhor.
 * Atualiza sozinho a cada 15 minutos.
 */
function WidgetWindguru({ modelo, params, titulo, altura, idioma }: (typeof TABELAS)[number] & { idioma: Idioma }) {
  const origem = typeof window === "undefined" ? "" : `&hostname=${encodeURIComponent(window.location.hostname)}`;
  const args = [`s=${SPOT}`, `m=${modelo}`, `uid=wg_fwdg_${SPOT}_${modelo}`, ...BASE, `lng=${idioma}`, `p=${params}`].join("&");
  return (
    <iframe
      src={`https://www.windguru.cz/widget-fcst-iframe.php?${args}${origem}`}
      title={titulo[idioma]}
      loading="lazy"
      className={`block w-full rounded-xl border-0 lg:[zoom:1.15] ${altura}`}
    />
  );
}

export default function Previsao() {
  const { idioma, t } = useIdioma();
  return (
    <section id="previsao" className="py-16 sm:py-24">
      <div className="shell">
        <Cabecalho
          rotulo={t("Previsão do vento", "Wind forecast")}
          apoio={t(
            "Previsão do Windguru para a Praia do Cumbuco, com vento, ondas e a nota do dia para os próximos 5 dias.",
            "Windguru forecast for Cumbuco Beach, with wind, waves and the daily rating for the next 5 days.",
          )}
        >
          {t("Veja o vento", "Check the wind")} <span className="suave">{t("antes de sair de casa", "before you leave home")}</span>
        </Cabecalho>

        <div className="mx-auto mt-14 max-w-5xl rounded-painel bg-bandeja p-2 sm:p-3">
          <div className="space-y-3 rounded-3xl bg-white p-3 sm:p-5">
            {TABELAS.map((tab) => (
              <WidgetWindguru key={`${tab.modelo}-${idioma}`} {...tab} idioma={idioma} />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 px-3 pb-2 pt-5 sm:px-4">
            <p className="max-w-md text-sm leading-relaxed text-maré">
              {t(
                "Na dúvida se o dia está bom para a sua aula, fale com a equipe: a gente olha a água por você.",
                "Not sure if it's a good day for your lesson? Ask the team: we'll check the water for you.",
              )}
            </p>
            <Botao href={`https://www.windguru.cz/${SPOT}`} externo variante="cinza">
              {t("Ver no Windguru", "Open on Windguru")}
            </Botao>
          </div>
        </div>
      </div>
    </section>
  );
}
