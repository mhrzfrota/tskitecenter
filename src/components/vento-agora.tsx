import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { CUMBUCO } from "@/marca";
import { useIdioma, type Idioma } from "@/idioma";

type Leitura = { nos: number; rajada: number; direcao: number; hora: string };

const PONTOS = {
  pt: [
    "norte", "nor-nordeste", "nordeste", "lés-nordeste",
    "leste", "lés-sudeste", "sudeste", "su-sudeste",
    "sul", "su-sudoeste", "sudoeste", "oés-sudoeste",
    "oeste", "oés-noroeste", "noroeste", "nor-noroeste",
  ],
  en: ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"],
};
const pontoCardeal = (graus: number, idioma: Idioma) => PONTOS[idioma][Math.round(graus / 22.5) % 16];

/**
 * Leitura em linguagem de aluno, não de meteorologista. As faixas são
 * referência geral de kite; FALTA validar com o instrutor da escola.
 */
function veredito(nos: number, idioma: Idioma) {
  const en = idioma === "en";
  if (nos < 12) return en ? "Light wind now" : "Vento fraco agora";
  if (nos <= 28) return en ? "Good to ride" : "Bom para velejar";
  return en ? "Strong, experienced riders only" : "Forte, só para quem já veleja";
}

/**
 * Vento do Cumbuco em tempo real pelo Open-Meteo: gratuito, sem chave e
 * já devolve em nós. É o embrião da futura página de previsão.
 */
function useVento() {
  const [leitura, setLeitura] = useState<Leitura | null>(null);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${CUMBUCO.lat}&longitude=${CUMBUCO.lon}` +
      "&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=kn&timezone=America%2FFortaleza";
    const controle = new AbortController();

    // Se uma atualização falhar, a última leitura boa continua na tela
    const ler = () =>
      fetch(url, { signal: controle.signal })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((d) => {
          setLeitura({
            nos: Math.round(d.current.wind_speed_10m),
            rajada: Math.round(d.current.wind_gusts_10m),
            direcao: d.current.wind_direction_10m,
            hora: String(d.current.time).slice(11, 16),
          });
          setFalhou(false);
        })
        .catch((e) => e?.name !== "AbortError" && setFalhou(true));

    ler();
    // Mesmo ritmo do widget do Windguru: a cada 15 minutos
    const relogio = setInterval(ler, 15 * 60 * 1000);
    return () => {
      clearInterval(relogio);
      controle.abort();
    };
  }, []);

  return { leitura, falhou };
}

/** Bloco de vento para a faixa de vidro do hero (texto branco). */
export default function VentoAgora() {
  const { leitura, falhou } = useVento();
  const { idioma, t } = useIdioma();

  return (
    <div id="vento" aria-live="polite" className="flex items-center gap-4">
      <div>
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/90">
          <span className={`h-1.5 w-1.5 rounded-full ${leitura ? "animate-pulse bg-sol" : "bg-white/40"}`} />
          {t("Cumbuco agora", "Cumbuco now")}
        </p>
        {leitura ? (
          <p className="mt-1 flex items-center gap-2 text-sm text-white">
            <span className="text-2xl font-medium tracking-[-0.04em]">{leitura.nos}</span>
            <span>{t("nós · rajadas", "knots · gusts")} {leitura.rajada}</span>
            {/* A seta aponta para onde o vento vai, não de onde vem */}
            <ArrowUp
              aria-label={t(`de ${pontoCardeal(leitura.direcao, idioma)}`, `from ${pontoCardeal(leitura.direcao, idioma)}`)}
              className="h-4 w-4 text-sol"
              style={{ transform: `rotate(${leitura.direcao + 180}deg)` }}
              strokeWidth={2.5}
            />
          </p>
        ) : falhou ? (
          <p className="mt-1 text-sm text-white/80">{t("Temporada forte de julho a janeiro", "Strong season from July to January")}</p>
        ) : (
          <div className="mt-1.5 h-6 w-40 animate-pulse rounded-full bg-white/20" aria-label={t("Lendo o vento", "Reading the wind")} />
        )}
      </div>
      {leitura && (
        <span className="hidden rounded-full bg-white px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-mar lg:inline">
          {veredito(leitura.nos, idioma)}
        </span>
      )}
    </div>
  );
}
