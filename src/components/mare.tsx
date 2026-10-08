import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CUMBUCO } from "@/marca";
import { useIdioma } from "@/idioma";
import { agoraFortaleza, deMin, estadoAgora, extremos, paraMin, serie, type Extremo } from "@/mare";

const URL_MARE =
  `https://marine-api.open-meteo.com/v1/marine?latitude=${CUMBUCO.lat}&longitude=${CUMBUCO.lon}` +
  "&hourly=sea_level_height_msl&timezone=America%2FFortaleza&past_days=1&forecast_days=6";

const HORAS = 120; // mesmo alcance das tabelas do Windguru (5 dias)
const DIAS = { pt: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"], en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] };

// Alturas da faixa, em px
const TOPO = 22; // cabeçalho dos dias
const ROTULO = 13; // horário da cheia (em cima) e da seca (embaixo)
const CURVA = 48;
const ALTURA = TOPO + ROTULO + CURVA + ROTULO + 4;

type Dados = { pontos: { t: number; v: number }[]; lista: Extremo[] };

function useMare() {
  const [dados, setDados] = useState<Dados | null>(null);
  const [falhou, setFalhou] = useState(false);
  const [agora, setAgora] = useState(agoraFortaleza);

  useEffect(() => {
    const controle = new AbortController();
    fetch(URL_MARE, { signal: controle.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setDados({ pontos: serie(d.hourly.time, d.hourly.sea_level_height_msl), lista: extremos(d.hourly.time, d.hourly.sea_level_height_msl) }))
      .catch((e) => e?.name !== "AbortError" && setFalhou(true));
    const relogio = setInterval(() => setAgora(agoraFortaleza()), 60_000);
    return () => {
      controle.abort();
      clearInterval(relogio);
    };
  }, []);

  return { dados, falhou, agora };
}

/** Largura disponível para a curva; abaixo de 7 px por hora, a faixa rola para o lado (como a do Windguru). */
function useLargura() {
  const ref = useRef<HTMLDivElement>(null);
  const [largura, setLargura] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => setLargura(el.clientWidth);
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, largura };
}

/** Curva suave pelos pontos (Catmull-Rom convertido em Bézier). */
function caminho(p: [number, number][]) {
  if (p.length < 2) return "";
  let d = `M${p[0][0]},${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const [x0, y0] = p[i - 1] ?? p[i];
    const [x1, y1] = p[i];
    const [x2, y2] = p[i + 1];
    const [x3, y3] = p[i + 2] ?? p[i + 1];
    d += ` C${x1 + (x2 - x0) / 6},${y1 + (y2 - y0) / 6} ${x2 - (x3 - x1) / 6},${y2 - (y3 - y1) / 6} ${x2},${y2}`;
  }
  return d;
}

/**
 * Faixa de maré no formato da linha "Maré MSL" do Windguru: curva contínua,
 * verde acima do nível médio do mar e vermelha abaixo, horário da cheia sobre
 * o pico e da seca embaixo, um bloco por dia e uma linha no agora.
 * Some se a API falhar: a seção segue com o Windguru.
 */
export default function Mare() {
  const { dados, falhou, agora } = useMare();
  const { idioma, t } = useIdioma();
  const { ref, largura } = useLargura();
  if (falhou) return null;

  // Coluna fixa da esquerda, como a do Windguru; mais estreita no celular
  const LEGENDA = largura && largura < 600 ? 64 : 112;
  const inicio = Math.floor(paraMin(agora) / 60) * 60;
  const fim = inicio + HORAS * 60;
  const pxHora = Math.max((largura - LEGENDA) / HORAS, 7);
  const W = Math.round(HORAS * pxHora);
  const x = (min: number) => ((min - inicio) / 60) * pxHora;

  const pontos = dados?.pontos.filter((p) => p.t >= inicio - 120 && p.t <= fim + 120) ?? [];
  const max = Math.max(1, ...pontos.map((p) => Math.abs(p.v)));
  const y0 = TOPO + ROTULO + CURVA / 2; // nível médio (MSL)
  const y = (v: number) => y0 - (v / max) * (CURVA / 2);
  const d = caminho(pontos.map((p) => [x(p.t), y(p.v)]));
  const area = d ? `${d} L${x(pontos[pontos.length - 1].t)},${y0} L${x(pontos[0].t)},${y0} Z` : "";

  // Meias-noites dentro da janela: separam os dias
  const dias: number[] = [];
  for (let m = Math.ceil(inicio / 1440) * 1440; m < fim; m += 1440) dias.push(m);
  const blocos = [inicio, ...dias].map((ini, i, todos) => ({ ini, fim: todos[i + 1] ?? fim }));
  const rotuloDia = (m: number) => {
    const s = deMin(m);
    return `${DIAS[idioma][new Date(`${s.slice(0, 10)}T12:00:00Z`).getUTCDay()]} ${Number(s.slice(8, 10))}`;
  };
  const extremosNaJanela = (dados?.lista ?? []).filter((e) => paraMin(e.quando) >= inicio && paraMin(e.quando) <= fim);
  const estado = dados ? estadoAgora(dados.lista, agora) : null;
  const hora = (e: Extremo) => e.quando.slice(11, 16);

  return (
    <figure className="overflow-hidden rounded-xl border border-[#E3E3E3] bg-white" aria-label={t("Maré no Cumbuco, próximos 5 dias", "Tide in Cumbuco, next 5 days")}>
      <div ref={ref} className="flex">
        {/* Legenda fixa, como a coluna do Windguru */}
        <div className="flex shrink-0 flex-col justify-center border-r border-[#E3E3E3] bg-white text-center text-[12px] leading-tight text-[#222]" style={{ width: LEGENDA, paddingTop: TOPO }}>
          <span>{t("Maré", "Tide")}</span>
          <span>MSL</span>
        </div>

        <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:thin]">
          {dados === null ? (
            <div className="animate-pulse bg-bandeja" style={{ width: W || "100%", height: ALTURA }} />
          ) : (
            <svg width={W} height={ALTURA} className="block font-sans" role="img" aria-label={extremosNaJanela.map((e) => `${e.tipo === "cheia" ? t("cheia", "high") : t("seca", "low")} ${e.quando.slice(8, 10)}/${e.quando.slice(5, 7)} ${hora(e)}`).join(", ")}>
              <defs>
                <linearGradient id="mare-cheia" gradientUnits="userSpaceOnUse" x1="0" y1={TOPO + ROTULO} x2="0" y2={y0}>
                  <stop offset="0" stopColor="#2DBE2D" />
                  <stop offset="1" stopColor="#FFFFFF" />
                </linearGradient>
                <linearGradient id="mare-seca" gradientUnits="userSpaceOnUse" x1="0" y1={y0} x2="0" y2={TOPO + ROTULO + CURVA}>
                  <stop offset="0" stopColor="#FFFFFF" />
                  <stop offset="1" stopColor="#E8323C" />
                </linearGradient>
                <clipPath id="mare-acima"><rect x="0" y="0" width={W} height={y0} /></clipPath>
                <clipPath id="mare-abaixo"><rect x="0" y={y0} width={W} height={ALTURA - y0} /></clipPath>
              </defs>

              {/* Cabeçalho dos dias */}
              {blocos.map((b) => (
                <g key={b.ini}>
                  <rect x={x(b.ini)} y="0" width={Math.max(0, x(b.fim) - x(b.ini))} height={TOPO - 2} fill={new Date(`${deMin(b.ini).slice(0, 10)}T12:00:00Z`).getUTCDay() % 6 === 0 ? "#D9D9D9" : "#EDEDED"} />
                  {x(b.fim) - x(b.ini) > 34 && (
                    <text x={(x(b.ini) + x(b.fim)) / 2} y={TOPO - 7} textAnchor="middle" fontSize="11" fill="#333">{rotuloDia(b.ini)}</text>
                  )}
                </g>
              ))}

              {/* Curva: verde acima do MSL, vermelha abaixo */}
              <path d={area} fill="url(#mare-cheia)" clipPath="url(#mare-acima)" />
              <path d={area} fill="url(#mare-seca)" clipPath="url(#mare-abaixo)" />
              <path d={d} fill="none" stroke="#222" strokeWidth="1" />
              <line x1="0" x2={W} y1={y0} y2={y0} stroke="#E8323C" strokeOpacity="0.35" strokeWidth="1" />

              {/* Separação entre os dias, como no Windguru */}
              {dias.map((m) => (
                <rect key={m} x={x(m) - 1.5} y="0" width="3" height={ALTURA} fill="#FFFFFF" />
              ))}

              {/* Agora */}
              <line x1={x(paraMin(agora))} x2={x(paraMin(agora))} y1={TOPO} y2={ALTURA} stroke="#06222B" strokeOpacity="0.45" strokeDasharray="2 2" />

              {/* Horários: cheia em cima do pico, seca embaixo */}
              {extremosNaJanela.map((e) => {
                const cx = Math.min(Math.max(x(paraMin(e.quando)), 16), W - 16);
                return (
                  <text key={e.quando} x={cx} y={e.tipo === "cheia" ? TOPO + ROTULO - 3 : ALTURA - 5} textAnchor="middle" fontSize="10" fill="#222" className="tabular-nums">
                    {hora(e)}
                  </text>
                );
              })}
            </svg>
          )}
        </div>
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[#E3E3E3] px-3 py-2 text-[12px] text-maré">
        {estado ? (
          <span className="font-medium text-mar">
            {estado.subindo
              ? t(`Enchendo agora, cheia às ${hora(estado.proximo)}`, `Rising now, high at ${hora(estado.proximo)}`)
              : t(`Vazando agora, seca às ${hora(estado.proximo)}`, `Falling now, low at ${hora(estado.proximo)}`)}
          </span>
        ) : <span />}
        <span>{t("Horários aproximados (Open-Meteo, ajustado ao Windguru). Confirme com a equipe.", "Approximate times (Open-Meteo, matched to Windguru). Check with the team.")}</span>
      </figcaption>
    </figure>
  );
}
