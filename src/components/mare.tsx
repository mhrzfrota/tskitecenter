import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Waves } from "lucide-react";
import { CUMBUCO } from "@/marca";
import { useIdioma } from "@/idioma";
import { agoraFortaleza, estadoAgora, extremos, porDia, type Extremo } from "@/mare";

const URL_MARE =
  `https://marine-api.open-meteo.com/v1/marine?latitude=${CUMBUCO.lat}&longitude=${CUMBUCO.lon}` +
  "&hourly=sea_level_height_msl&timezone=America%2FFortaleza&forecast_days=4";

function useMare() {
  const [lista, setLista] = useState<Extremo[] | null>(null);
  const [falhou, setFalhou] = useState(false);
  const [agora, setAgora] = useState(agoraFortaleza);

  useEffect(() => {
    const controle = new AbortController();
    fetch(URL_MARE, { signal: controle.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setLista(extremos(d.hourly.time, d.hourly.sea_level_height_msl)))
      .catch((e) => e?.name !== "AbortError" && setFalhou(true));
    // "Enchendo/vazando" acompanha o relógio
    const relogio = setInterval(() => setAgora(agoraFortaleza()), 60_000);
    return () => {
      controle.abort();
      clearInterval(relogio);
    };
  }, []);

  return { lista, falhou, agora };
}

/**
 * Cheias e secas de hoje e dos próximos dois dias, e se a maré está
 * enchendo ou vazando agora. Some se a API falhar: a seção continua com o
 * Windguru e o botão para o site deles.
 */
export default function Mare() {
  const { lista, falhou, agora } = useMare();
  const { idioma, t } = useIdioma();
  if (falhou) return null;

  const hoje = agora.slice(0, 10);
  const dias = lista ? porDia(lista).filter(([d]) => d >= hoje).slice(0, 3) : [];
  const estado = lista ? estadoAgora(lista, agora) : null;
  const hora = (e: Extremo) => e.quando.slice(11, 16).replace(":", "h");
  const nomeDia = (d: string, i: number) =>
    i === 0 ? t("Hoje", "Today") : i === 1 ? t("Amanhã", "Tomorrow")
      : new Date(`${d}T12:00:00Z`).toLocaleDateString(idioma === "en" ? "en-GB" : "pt-BR", { weekday: "long", timeZone: "UTC" });

  return (
    <div aria-live="polite" className="rounded-2xl bg-bandeja p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-maré">
          <Waves aria-hidden className="h-4 w-4 text-lagoa-forte" /> {t("Maré no Cumbuco", "Tide in Cumbuco")}
        </p>
        {estado && (
          <p className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-medium">
            {estado.subindo ? <ArrowUp aria-hidden className="h-4 w-4 text-lagoa-forte" /> : <ArrowDown aria-hidden className="h-4 w-4 text-lagoa-forte" />}
            {estado.subindo
              ? t(`Enchendo agora, cheia às ${hora(estado.proximo)}`, `Rising now, high at ${hora(estado.proximo)}`)
              : t(`Vazando agora, seca às ${hora(estado.proximo)}`, `Falling now, low at ${hora(estado.proximo)}`)}
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {lista === null
          ? [0, 1, 2].map((i) => <div key={i} className="h-[92px] animate-pulse rounded-xl bg-white/70" />)
          : dias.map(([dia, itens], i) => (
              <div key={dia} className="rounded-xl bg-white p-3">
                <p className="text-sm font-medium capitalize">{nomeDia(dia, i)}</p>
                <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {itens.map((e) => {
                    const passou = e.quando <= agora;
                    return (
                      <li key={e.quando} className={`flex items-baseline gap-1.5 text-sm ${passou ? "text-maré/60 line-through decoration-maré/30" : ""}`}>
                        <span className={`font-mono text-[10px] uppercase tracking-[0.1em] ${e.tipo === "cheia" ? "text-lagoa-forte" : "text-maré"}`}>
                          {e.tipo === "cheia" ? t("Cheia", "High") : t("Seca", "Low")}
                        </span>
                        <span className="tabular-nums">{hora(e)}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
      </div>
      <p className="mt-3 text-xs text-maré">
        {t("Horários aproximados (Open-Meteo, ajustado ao Windguru). Confirme com a equipe antes da aula.", "Approximate times (Open-Meteo, matched to Windguru). Check with the team before your lesson.")}
      </p>
    </div>
  );
}
