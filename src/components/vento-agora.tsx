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
  if (nos < 12) return "Vento fraco agora";
  if (nos <= 28) return "Bom para velejar";
  return "Forte, só para quem já veleja";
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

  return { leitura, falhou };
}

/** Bloco de vento para a faixa de vidro do hero (texto branco). */
export default function VentoAgora() {
  const { leitura, falhou } = useVento();

  return (
    <div id="vento" aria-live="polite" className="flex items-center gap-4">
      <div>
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/80">
          <span className={`h-1.5 w-1.5 rounded-full ${leitura ? "animate-pulse bg-sol" : "bg-white/40"}`} />
          Cumbuco agora
        </p>
        {leitura ? (
          <p className="mt-1 flex items-center gap-2 text-sm text-white">
            <span className="text-2xl font-medium tracking-[-0.04em]">{leitura.nos}</span>
            <span>nós · rajadas {leitura.rajada}</span>
            {/* A seta aponta para onde o vento vai, não de onde vem */}
            <ArrowUp
              aria-label={`de ${pontoCardeal(leitura.direcao)}`}
              className="h-4 w-4 text-sol"
              style={{ transform: `rotate(${leitura.direcao + 180}deg)` }}
              strokeWidth={2.5}
            />
          </p>
        ) : falhou ? (
          <p className="mt-1 text-sm text-white/80">Temporada forte de julho a janeiro</p>
        ) : (
          <div className="mt-1.5 h-6 w-40 animate-pulse rounded-full bg-white/20" aria-label="Lendo o vento" />
        )}
      </div>
      {leitura && (
        <span className="hidden rounded-full bg-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-white lg:inline">
          {veredito(leitura.nos)}
        </span>
      )}
    </div>
  );
}
