import { ArrowUpRight, Check } from "lucide-react";
import { linkWhatsApp } from "@/marca";

/**
 * As etapas são uma sequência de verdade (ninguém pula da areia para o
 * salto), por isso levam número. A faixa colorida no topo de cada cartão
 * cresce de um terço até o cartão inteiro: é a mesma progressão, desenhada.
 *
 * FALTA confirmar com a escola: nomes das etapas, duração, preço e se o
 * equipamento está incluso. O conteúdo abaixo segue a progressão padrão
 * do kite e deve ser ajustado ao que a TS realmente oferece.
 */
const ETAPAS = [
  {
    nome: "Primeiro contato",
    paraQuem: "Para quem nunca pegou numa pipa.",
    aprende: ["Segurança e leitura do vento", "Montar e controlar a pipa na areia", "Body drag: deixar a pipa te puxar na água"],
  },
  {
    nome: "Primeiro bordo",
    paraQuem: "Para quem já controla a pipa.",
    aprende: ["Subir na prancha (water start)", "Velejar os primeiros metros", "Parar e recuperar a prancha"],
  },
  {
    nome: "Independência",
    paraQuem: "Para quem já fica em pé.",
    aprende: ["Controlar a velocidade", "Orçar e voltar ao ponto de saída", "Entrar e sair da água sozinho"],
  },
];

export default function Aulas() {
  return (
    <section id="aulas" className="scroll-mt-16 px-4 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="rotulo text-lagoa-forte">Aulas</p>
            <h2 className="titulo mt-4 text-4xl sm:text-5xl lg:text-6xl">
              Três etapas até você velejar sozinho.
            </h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-maré lg:justify-self-end">
            Cada aluno começa de onde está. Na primeira conversa a gente entende o seu nível e monta o
            caminho com você.
          </p>
        </div>

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {ETAPAS.map((etapa, i) => (
            <li key={etapa.nome} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_0_rgba(6,34,43,0.06),0_20px_40px_-24px_rgba(6,34,43,0.25)]">
              <div className="h-1.5 bg-mar/5">
                <div className="h-full bg-marca" style={{ width: `${((i + 1) / ETAPAS.length) * 100}%` }} />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <p className="rotulo text-maré">Etapa {i + 1}</p>
                <h3 className="mt-3 font-display text-2xl font-extrabold italic tracking-tight [font-stretch:115%]">
                  {etapa.nome}
                </h3>
                <p className="mt-1 text-sm text-maré">{etapa.paraQuem}</p>

                <ul className="mt-6 flex-1 space-y-3 border-t border-mar/10 pt-6">
                  {etapa.aprende.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] leading-snug">
                      <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-lagoa-forte" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>

                <a
                  href={linkWhatsApp(`Olá! Quero agendar a etapa "${etapa.nome}" das aulas de kite.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex items-center gap-1.5 self-start font-semibold text-lagoa-forte"
                >
                  Agendar esta etapa
                  <ArrowUpRight aria-hidden className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
