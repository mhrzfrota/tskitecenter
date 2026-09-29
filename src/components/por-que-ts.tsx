import { ArrowUp, Wind } from "lucide-react";
import Foto from "./foto";

const ETIQUETAS = [
  ["Segurança", "Certificado IKO", "Instrutores qualificados", "Equipamento North", "Plano sob medida"],
  ["Espaço kids", "Chuveiros", "Estacionamento", "Gramado para montar"],
];

const NUMEROS = [
  { valor: "2.000+", rotulo: "Alunos certificados" },
  { valor: "5/5", rotulo: "Nota no TripAdvisor" },
  { valor: "10h", rotulo: "Curso para iniciante" },
  { valor: "Jul–Jan", rotulo: "Temporada de vento forte" },
];

/** Uma fileira de etiquetas correndo (duplicada para o laço não ter emenda). */
function Faixa({ itens, inverso }: { itens: string[]; inverso?: boolean }) {
  const lista = [...itens, ...itens];
  return (
    <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <ul className="correr flex w-max gap-2" style={inverso ? { animationDirection: "reverse" } : undefined}>
        {lista.map((t, i) => (
          <li key={i} aria-hidden={i >= itens.length} className="whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-[13px]">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * "Sobre" no formato da referência: título grande com um ícone no meio da
 * frase, dois cards (etiquetas + foto) e a fileira de números.
 * FALTA: certificação dos instrutores (IKO?).
 */
export default function PorQueTs() {
  return (
    <section id="sobre" className="bg-white py-20 sm:py-28">
      <div className="shell">
        <div className="mx-auto max-w-4xl text-center">
          <p className="rotulo">Sobre a TS</p>
          <h2 className="titulo mt-5 text-[2.1rem] sm:text-5xl sm:leading-[1.2]">
            Dois irmãos nascidos no Cumbuco{" "}
            <span className="mx-1 inline-flex h-10 w-10 translate-y-[-0.1em] items-center justify-center rounded-full bg-marca align-middle sm:h-12 sm:w-12">
              <Wind aria-hidden className="h-5 w-5 text-white sm:h-6 sm:w-6" />
            </span>{" "}
            <span className="suave">e uma família inteira vivendo o vento</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-maré">
            Set e Tomás Teixeira cresceram na praia, competiram e transformaram a paixão numa das maiores
            escolas do Cumbuco, com alunos do mundo todo.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="flex min-w-0 flex-col justify-between gap-10 overflow-hidden rounded-3xl bg-bandeja py-5">
            <div className="space-y-2">
              <Faixa itens={ETIQUETAS[0]} />
              <Faixa itens={ETIQUETAS[1]} inverso />
            </div>
            <div className="px-5">
              <p className="text-sm">O que você encontra aqui</p>
              <p className="titulo mt-1 text-4xl">Estrutura completa</p>
            </div>
          </div>

          <div className="relative isolate aspect-[4/3] overflow-hidden rounded-3xl sm:aspect-auto sm:min-h-[260px]">
            <div className="absolute inset-0 -z-10">
              <Foto tom="ceu" descricao="Set e Tomás Teixeira na praia do Cumbuco" />
            </div>
            <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,34,43,0)_40%,rgba(6,34,43,0.75)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="titulo text-4xl">2.000+</p>
              <p className="mt-1 text-sm text-white/90">alunos certificados, do Brasil e do mundo.</p>
            </div>
          </div>
        </div>

        <ul className="mt-16 grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {NUMEROS.map((n) => (
            <li key={n.rotulo} className="flex flex-col items-center text-center">
              <p className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-mar">
                  <ArrowUp aria-hidden className="h-4 w-4 text-sol" strokeWidth={2.5} />
                </span>
                <span className="titulo text-4xl sm:text-5xl">{n.valor}</span>
              </p>
              <p className="mt-2 text-sm text-maré">{n.rotulo}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
