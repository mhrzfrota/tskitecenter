/**
 * Força do vento por mês, em escala qualitativa de 1 a 5 (não é medição).
 * Segue o que se sabe da temporada no Cumbuco: forte de julho a janeiro,
 * pico de agosto a novembro. FALTA a escola validar.
 */
const MESES = [
  { m: "jan", f: 3 }, { m: "fev", f: 2 }, { m: "mar", f: 1 }, { m: "abr", f: 1 },
  { m: "mai", f: 2 }, { m: "jun", f: 2 }, { m: "jul", f: 4 }, { m: "ago", f: 5 },
  { m: "set", f: 5 }, { m: "out", f: 5 }, { m: "nov", f: 5 }, { m: "dez", f: 4 },
];

const LUGARES = [
  {
    nome: "O mar",
    texto:
      "Vento de leste constante, praia larga e ondas que crescem conforme você evolui. É onde o kite do Cumbuco ganhou fama.",
  },
  {
    nome: "A lagoa do Cauípe",
    texto:
      "Água lisa e rasa, dá pé em quase toda a extensão. O lugar mais tranquilo para os primeiros bordos e para treinar manobras.",
  },
];

export default function Spot() {
  const mesAtual = new Date().getMonth();

  return (
    <section id="spot" className="scroll-mt-16 bg-white px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <p className="rotulo text-lagoa-forte">O spot</p>
        <h2 className="titulo mt-4 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">
          Por que o Cumbuco.
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          {LUGARES.map((l) => (
            <div key={l.nome} className="border-l-2 border-sol pl-6">
              <h3 className="font-display text-2xl font-extrabold italic tracking-tight [font-stretch:115%]">{l.nome}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-maré">{l.texto}</p>
            </div>
          ))}
        </div>

        {/* Temporada: a altura é a força do vento, o degradê da marca pinta os meses fortes */}
        <figure className="mt-20 rounded-3xl bg-mar px-5 pb-6 pt-8 text-white sm:px-10 sm:pb-8 sm:pt-10">
          <figcaption className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="rotulo text-sol">Temporada de vento</p>
              <p className="mt-3 font-display text-2xl font-bold italic [font-stretch:115%] sm:text-3xl">
                De julho a janeiro. Pico de agosto a novembro.
              </p>
            </div>
            <p className="max-w-xs text-sm text-bruma">
              Venta o ano todo. O gráfico mostra quando ele é mais forte e constante.
            </p>
          </figcaption>

          <ol className="mt-10 grid h-44 grid-cols-12 items-end gap-1.5 sm:h-56 sm:gap-3" aria-label="Força do vento por mês">
            {MESES.map((mes, i) => {
              const forte = mes.f >= 4;
              const agora = i === mesAtual;
              return (
                <li key={mes.m} className="flex h-full flex-col justify-end" aria-label={`${mes.m}: força ${mes.f} de 5`}>
                  <div
                    className={`w-full rounded-t-md ${forte ? "bg-marca" : "bg-white/15"}`}
                    style={{ height: `${mes.f * 20}%` }}
                  />
                  <span
                    className={`mt-2 text-center font-mono text-[10px] uppercase sm:text-xs ${
                      agora ? "font-semibold text-sol" : "text-bruma"
                    }`}
                  >
                    {mes.m}
                  </span>
                  <span className={`mx-auto mt-1 h-1 w-1 rounded-full ${agora ? "bg-sol" : "bg-transparent"}`} />
                </li>
              );
            })}
          </ol>
        </figure>
      </div>
    </section>
  );
}
