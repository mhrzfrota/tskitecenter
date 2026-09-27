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

  // Faixa logo abaixo do hero: o embrião da futura página de previsão
  return (
    <section id="vento" aria-live="polite" className="border-b border-mar/10 bg-white">
      <div className="shell flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex items-center gap-3">
          <span className={`h-2 w-2 rounded-full ${leitura ? "animate-pulse bg-lagoa" : "bg-maré/40"}`} />
          <p className="eyebrow">Cumbuco agora</p>
        </div>

        {leitura ? (
          <>
            <div className="flex items-center gap-6">
              <p className="flex items-baseline gap-2">
                <span className="font-mono text-4xl font-semibold leading-none">{leitura.nos}</span>
                <span className="font-mono text-sm">nós</span>
              </p>
              <p className="text-sm text-maré">rajadas de {leitura.rajada}</p>
              <p className="flex items-center gap-2 text-sm text-maré">
                {/* A seta aponta para onde o vento vai, não de onde vem */}
                <ArrowUp
                  aria-hidden
                  className="h-5 w-5 text-lagoa-forte"
                  style={{ transform: `rotate(${leitura.direcao + 180}deg)` }}
                  strokeWidth={2.25}
                />
                de {pontoCardeal(leitura.direcao)}
              </p>
            </div>
            <div className="md:text-right">
              <p className="text-sm font-medium uppercase tracking-[0.15em]">{veredito(leitura.nos)}</p>
              <p className="mt-1 font-mono text-[10px] text-maré">Open-Meteo, leitura das {leitura.hora}</p>
            </div>
          </>
        ) : falhou ? (
          <p className="text-sm text-maré">A leitura do vento não carregou agora. A temporada forte vai de julho a janeiro.</p>
        ) : (
          <div className="h-9 w-64 animate-pulse bg-mar/10" aria-label="Lendo o vento" />
        )}
      </div>
    </section>
  );
}
