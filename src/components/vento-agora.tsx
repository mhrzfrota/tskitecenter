import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { CUMBUCO } from "@/marca";

type Leitura = { nos: number; rajada: number; direcao: number; hora: string };

const PONTOS = [
  "norte", "nor-nordeste", "nordeste", "lés-nordeste",
  "leste", "lés-sudeste", "sudeste", "su-sudeste",
  "sul", "su-sudoeste", "sudoeste", "oés-sudoeste",
  "oeste", "oés-noroeste", "noroeste", "nor-noroeste",
];
const pontoCardeal = (graus: number) => PONTOS[Math.round(graus / 22.5) % 16];

/**
 * Leitura em linguagem de aluno, não de meteorologista. As faixas são
 * referência geral de kite; FALTA validar com o instrutor da escola.
 */
function veredito(nos: number) {
  if (nos < 12) return "Vento fraco para velejar agora";
  if (nos <= 28) return "Vento bom para velejar";
  return "Vento forte, só para quem já veleja";
}

/**
 * Vento do Cumbuco em tempo real pelo Open-Meteo: gratuito, sem chave e
 * já devolve em nós. É o embrião da futura tela de previsão.
 */
export default function VentoAgora() {
  const [leitura, setLeitura] = useState<Leitura | null>(null);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${CUMBUCO.lat}&longitude=${CUMBUCO.lon}` +
      "&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=kn&timezone=America%2FFortaleza";
    const controle = new AbortController();
    fetch(url, { signal: controle.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) =>
        setLeitura({
          nos: Math.round(d.current.wind_speed_10m),
          rajada: Math.round(d.current.wind_gusts_10m),
          direcao: d.current.wind_direction_10m,
          hora: String(d.current.time).slice(11, 16),
        }),
      )
      .catch((e) => e?.name !== "AbortError" && setFalhou(true));
    return () => controle.abort();
  }, []);

  return (
    <div
      aria-live="polite"
      className="w-full rounded-2xl border border-white/10 bg-mar-2/70 p-5 backdrop-blur-md sm:w-80"
    >
      <div className="flex items-center justify-between">
        <span className="rotulo text-bruma">Cumbuco agora</span>
        <span className="flex items-center gap-1.5 text-[11px] font-mono text-bruma">
          <span className={`h-1.5 w-1.5 rounded-full ${leitura ? "bg-lagoa animate-pulse" : "bg-bruma/50"}`} />
          ao vivo
        </span>
      </div>

      {leitura ? (
        <>
          <div className="mt-4 flex items-end gap-4">
            <p className="font-mono text-6xl font-semibold leading-none text-white">{leitura.nos}</p>
            <div className="pb-1">
              <p className="font-mono text-sm text-white">nós</p>
              <p className="text-xs text-bruma">rajadas de {leitura.rajada}</p>
            </div>
            {/* A seta aponta para onde o vento vai, não de onde vem */}
            <ArrowUp
              aria-hidden
              className="ml-auto h-10 w-10 text-sol transition-transform duration-700"
              style={{ transform: `rotate(${leitura.direcao + 180}deg)` }}
              strokeWidth={2.25}
            />
          </div>
          <p className="mt-3 text-sm text-bruma">
            Soprando de <span className="text-white">{pontoCardeal(leitura.direcao)}</span>
          </p>
          <p className="mt-4 border-t border-white/10 pt-3 text-sm font-semibold text-white">
            {veredito(leitura.nos)}
          </p>
          <p className="mt-1 font-mono text-[10px] text-bruma/80">Open-Meteo, leitura das {leitura.hora}</p>
        </>
      ) : falhou ? (
        <p className="mt-4 text-sm leading-relaxed text-bruma">
          A leitura do vento não carregou agora. A temporada forte vai de julho a janeiro.
        </p>
      ) : (
        <div className="mt-4 space-y-2" aria-label="Lendo o vento">
          <div className="h-14 w-32 animate-pulse rounded-lg bg-white/10" />
          <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
        </div>
      )}
    </div>
  );
}
