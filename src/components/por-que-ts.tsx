import Foto from "./foto";

/**
 * Números e motivos que a própria marca repete (briefing de 2026-09-27).
 * FALTA: certificação dos instrutores (IKO?) para citar em segurança.
 */
const NUMEROS = [
  { valor: "2.000+", rotulo: "alunos certificados" },
  { valor: "5/5", rotulo: "nota no TripAdvisor" },
  { valor: "10h", rotulo: "curso para iniciante" },
  { valor: "Bandeira Azul", rotulo: "Praia do Cumbuco" },
];

const MOTIVOS = [
  { titulo: "Segurança", texto: "Instrutores qualificados e equipamento de ponta." },
  { titulo: "Plano sob medida", texto: "Avaliamos você antes de montar as aulas." },
  { titulo: "Para a família", texto: "Espaço kids, chuveiros e área de convivência no Outro Beach Club." },
];

export default function PorQueTs() {
  return (
    <section id="por-que" className="py-16 sm:py-24">
      <div className="shell">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow">Por que a TS</p>
            <h2 className="titulo-secao mt-4">
              Vem aprender <strong>com os melhores</strong>
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed tracking-normal text-maré">
              Set e Tomás Teixeira nasceram e cresceram no Cumbuco, competiram e transformaram a paixão pelo
              vento em uma das maiores escolas da praia, com alunos do mundo todo. Um negócio de família, do
              jeito que a TS gosta: todo mundo vira família do kite.
            </p>

            <dl className="mt-8 space-y-5">
              {MOTIVOS.map((m) => (
                <div key={m.titulo} className="border-l-2 border-sol pl-5">
                  <dt className="text-xs font-medium uppercase tracking-[0.3em]">{m.titulo}</dt>
                  <dd className="mt-1 tracking-normal text-maré">{m.texto}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="aspect-[4/5] overflow-hidden shadow-[0_24px_48px_-24px_rgba(6,34,43,0.35)]">
            <Foto descricao="Set e Tomás Teixeira na praia do Cumbuco" />
          </div>
        </div>

        <ul className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {NUMEROS.map((n) => (
            <li
              key={n.valor}
              className="rounded-lg border border-mar/10 bg-white px-4 py-8 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(6,34,43,0.08)]"
            >
              <span className="block font-display text-2xl font-extrabold italic tracking-[0.08em] text-lagoa-forte sm:text-[1.75rem]">
                {n.valor}
              </span>
              <span className="mt-2 block text-[11px] font-medium uppercase leading-relaxed tracking-[0.15em] text-maré">
                {n.rotulo}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
