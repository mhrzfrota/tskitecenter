/**
 * Maré do Cumbuco, a partir do nível do mar hora a hora do Open-Meteo
 * (API marítima, gratuita e sem chave).
 *
 * Por que não vem do Windguru: o widget oficial recebe a maré desligada pelo
 * servidor deles ("tide": {"style": "none"}), qualquer parâmetro que se passe.
 * Só a página do spot mostra.
 *
 * AJUSTE: o ponto do Open-Meteo fica ~15 km mar adentro (a grade é grossa na
 * costa) e adianta a maré. Medido em 2026-10-07 contra os 11 horários de
 * cheia e seca do Windguru (spot 68535): adiantava 27 a 36 min, média 31.
 * Ao somar 30 min, a diferença fica em poucos minutos.
 */
export const AJUSTE_MIN = 30;

export type Extremo = { quando: string; tipo: "cheia" | "seca"; altura: number };

// Horário local "YYYY-MM-DDTHH:MM" tratado como UTC só para fazer conta, sem fuso no meio
const paraMin = (s: string) => Date.parse(`${s.slice(0, 16)}:00Z`) / 60000;
const deMin = (m: number) => new Date(Math.round(m) * 60000).toISOString().slice(0, 16);

/**
 * Cheias e secas pelos picos da série. Entre as três horas em volta do pico,
 * uma parábola dá o minuto e a altura do extremo (a série é de hora em hora).
 */
export function extremos(horas: string[], niveis: (number | null)[], ajuste = AJUSTE_MIN): Extremo[] {
  const lista: Extremo[] = [];
  for (let i = 1; i < niveis.length - 1; i++) {
    const a = niveis[i - 1], b = niveis[i], c = niveis[i + 1];
    if (a === null || b === null || c === null) continue;
    const cheia = b > a && b >= c;
    const seca = b < a && b <= c;
    if (!cheia && !seca) continue;
    const den = a - 2 * b + c;
    const desvio = den ? (0.5 * (a - c)) / den : 0; // em horas, entre -0,5 e 0,5
    lista.push({
      quando: deMin(paraMin(horas[i]) + desvio * 60 + ajuste),
      tipo: cheia ? "cheia" : "seca",
      altura: Math.round((b - 0.25 * (a - c) * desvio) * 100) / 100,
    });
  }
  return lista;
}

/** Enchendo ou vazando agora, e o próximo extremo. `agora` no mesmo formato local. */
export function estadoAgora(lista: Extremo[], agora: string): { subindo: boolean; proximo: Extremo } | null {
  const proximo = lista.find((e) => paraMin(e.quando) > paraMin(agora));
  return proximo ? { subindo: proximo.tipo === "cheia", proximo } : null;
}

/** Agrupa por dia (YYYY-MM-DD), na ordem. */
export function porDia(lista: Extremo[]): [string, Extremo[]][] {
  const dias = new Map<string, Extremo[]>();
  for (const e of lista) {
    const dia = e.quando.slice(0, 10);
    dias.set(dia, [...(dias.get(dia) ?? []), e]);
  }
  return [...dias];
}

/** Agora em Fortaleza, no formato "YYYY-MM-DDTHH:MM". */
export function agoraFortaleza(data = new Date()): string {
  return new Date(data.getTime() - 3 * 3600000).toISOString().slice(0, 16); // UTC-3, sem horário de verão
}
